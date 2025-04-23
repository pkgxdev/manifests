#!/usr/bin/ruby

require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'ruby-macho', '~> 3'
end

require 'macho'
require 'json'
require 'ostruct'

def main
  $file = MachO.open(ARGV.shift)

  $prefix = ARGV.shift
  $PKGX_DIR = ARGV.shift
  $LIBS = JSON.parse(ENV['LIBS']);

  case $file.filetype
  when :dylib
    fix_id
    fix_install_names
    assign_rpath
  when :execute
    fix_install_names
    assign_rpath
  when :bundle
    fix_install_names
    assign_rpath
  when :object
  when :dsym
    # noop
  else
    raise "unknown filetype: #{$file.filetype}: #{$file.filename}"
  end

  $file.write!
  codesign!
end

def fix_id
  # we make the id the major version to ensure things that link to this dylib
  # do not hardcode the path to this specific library thus breaking things on upgrades
  rel_path = Pathname.new($file.filename).relative_path_from(Pathname.new($PKGX_DIR))
  rel_path = rel_path.sub(%r{/v(\d+)\.(\d+\.)+\d+[a-z]?/}, '/v\1/')  # use the pkgx `v` prefixed symlink
  rel_path = rel_path.sub(%r{\.(\d+)\.(\d+\.)+\d+\.dylib$}, '.\1.dylib')  # use the dylib symlink
  id = "@rpath/#{rel_path}"
  $file.change_dylib_id id
end

def assign_rpath
  $file.rpaths.each do |rpath|
    $file.delete_rpath rpath
  end

  libs = $file.linked_dylibs.select do |lib|
    lib.start_with? '@rpath/'
  end

  unless libs.empty?
    prefix = $file.filetype == :execute ? "@executable_path" : "@loader_path"
    rel_path = Pathname.new($PKGX_DIR).relative_path_from(Pathname.new($file.filename).parent)
    $file.add_rpath "#{prefix}/#{rel_path}"
  end
end

def fix_install_names
  $file.linked_dylibs.map do |lib|
    next if lib.start_with? '/usr/lib' or lib.start_with? '/System/' or lib.start_with? '/Library/'

    og_lib_name = lib
    file = $LIBS.find{ |dep| lib_basename(dep['string']) == lib_basename(lib) }

    if file
      lib = file['string']
      # we sporadically use --prefix=/usr/local in conjunction with DESTDIR to work
      # around specifying eg. /etc as the conf path which then fails builds since it cannot write there
      if lib.start_with? $prefix or lib.start_with? "/usr/local/lib"

        if lib.start_with? "/usr/local/lib"
          lib = lib.sub(%r{^/usr/local}, $prefix)
        end

        rel_path = Pathname.new(lib).relative_path_from(Pathname.new($file.filename).parent)
        if $file.filetype == :execute
          change_install_name og_lib_name, "@executable_path/#{rel_path}"
        else
          change_install_name og_lib_name, "@loader_path/#{rel_path}"
        end
      else
        rel_path = Pathname.new(file['string']).relative_path_from($PKGX_DIR)
        rel_path = rel_path.sub(%r{/v(\d+)\.(\d+\.)+\d+[a-z]?/}, '/v\1/')  # use the pkgx `v` prefixed symlink
        rel_path = rel_path.sub(%r{\.(\d+)\.(\d+\.)+\d+\.dylib$}, '.\1.dylib')  # use the dylib symlink
        change_install_name og_lib_name, "@rpath/#{rel_path}"
      end
    elsif lib.start_with? '@rpath/'
      foo = lib.sub(%r{^@rpath/}, '')
      foo = foo.sub(%r{/v.*$}, '')
      pkgs = ENV['PKGS'] ? ENV['PKGS'].split(":").map{ |pkg| pkg.sub(%r{/v.*$}, '').sub(%r{^.*/pkgs/}, '') } : []
      if not pkgs.include? foo
        puts "::error file=#{$file.filename}::no fix available for: #{lib}"
      end
    end
  end
end

def change_install_name(og_lib_name, new_name)
  puts "  changing install name"
  puts "    old: #{og_lib_name}"
  puts "    new: #{new_name}"
  $file.change_install_name og_lib_name, new_name
end

def codesign!
  signing_id = ENV['APPLE_IDENTITY'] || "-"

  _, _, status = Open3.capture3("codesign", "--sign", signing_id, "--force",
                                "--preserve-metadata=entitlements,requirements,flags,runtime",
                                $file.filename)

  raise MachO::CodeSigningError, "#{$file.filename}: signing failed!" unless status.success?
end

def lib_basename(lib)
  lib = File.basename(lib)
  lib = lib.sub(/(\.\d+)*\.dylib$/, '')
end

main
