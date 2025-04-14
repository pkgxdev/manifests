#include <iostream>
#include <string>
#include <fmt/format.h>
int main()
{
  std::string str = fmt::format("The answer is {}", 42);
  std::cout << str;
  return 0;
}
