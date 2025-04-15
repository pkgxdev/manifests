import site
import sys

# enable automatic user installs if pip makes the decision
# that this is good idea. eg. if /usr/local isn't writable
# this is what it will do
site.ENABLE_USER_SITE = True

# we want a consistent global site directory outside of the
# pkgx prefix
site.PREFIXES = ["/usr/local"]
