# Git

## Configuration

Though `~/.gitconfig` is the default, `git` will first look for
`${XDG_CONFIG_HOME:-$HOME/.config}/git/config` and use that if it exists which
allows XDG compliance.

Our Git is otherwise configured to use `/etc/git` for system level
configuration.

A “global” `gitignore` is sourced from
`${XDG_DATA_HOME:-$HOME/.local/share}/git/ignore`.

