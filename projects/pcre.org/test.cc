#include <iostream>
#include <string>
#include <pcrecpp.h>

int main() {
    std::string subject = "hello 123 world";
    pcrecpp::RE re("(\\w+) (\\d+) (\\w+)");
    std::string first, third;
    int number;

    if (re.FullMatch(subject, &first, &number, &third)) {
        std::cout << "Match succeeded:\n";
        std::cout << "first: " << first << "\n";
        std::cout << "number: " << number << "\n";
        std::cout << "third: " << third << "\n";
    } else {
        std::cout << "Match failed\n";
    }

    return 0;
}
