#include <p11-kit/p11-kit.h>
#include <stdio.h>

int main(void) {
    const char *msg = p11_kit_message();
    printf("p11-kit is working! Message: %s\n", msg ? msg : "(null)");
    return 0;
}