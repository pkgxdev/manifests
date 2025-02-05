#!/usr/bin/env -S pkgx ruby@3.2.2

require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'ruby-macho', '~> 3'
end

require 'macho'
require 'json'

def main
  $file = MachO.open(ARGV.shift)
  $prefix = ARGV.shift
  $PKGX_DIR = ARGV.shift
  $deps_map = JSON.parse(ENV['PKGX_DEPS_MAP'])

  case $file.filetype
  when :dylib
    fix_id
    assign_rpath
    fix_install_names
  when :execute
    assign_rpath
    fix_install_names
  when :bundle
    assign_rpath
    fix_install_names
  when :object
    # noop
  else
    throw Error("unknown filetype: #{@file.filetype}: #{@file.filename}")
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
    !(lib.start_with? '/usr/' or lib.start_with? '/System/' or lib.start_with? '/Library/')
  end
  return if libs.empty?

  prefix = $file.filetype == :execute ? "@executable_path" : "@loader_path"
  rel_path = Pathname.new($PKGX_DIR).relative_path_from(Pathname.new($file.filename).parent)
  $file.add_rpath "#{prefix}/#{rel_path}"
end

def fix_install_names
  $file.linked_dylibs.map do |lib|
    next if lib.start_with? '/usr/' or lib.start_with? '/System/' or lib.start_with? '/Library/'

    begin
      base = File.basename(lib)
      target_lib = $deps_map[base]['string'] + '/' + base
      rel_path = Pathname.new(target_lib).relative_path_from(Pathname.new($PKGX_DIR))
      rel_path = rel_path.sub(%r{/v(\d+)\.(\d+\.)+\d+[a-z]?/}, '/v\1/')  # use the pkgx `v` prefixed symlink
      rel_path = rel_path.sub(%r{\.(\d+)\.(\d+\.)+\d+\.dylib$}, '.\1.dylib')  # use the dylib symlink
      $file.change_install_name lib, "@rpath/#{rel_path}"
    rescue
      puts $file.filename, lib
      raise
    end
  end
end

def codesign!
  signing_id = ENV['APPLE_IDENTITY'] || "-"

  _, _, status = Open3.capture3("codesign", "--sign", signing_id, "--force",
                                "--preserve-metadata=entitlements,requirements,flags,runtime",
                                $file.filename)

  raise MachO::CodeSigningError, "#{$file.filename}: signing failed!" unless status.success?
end

main
