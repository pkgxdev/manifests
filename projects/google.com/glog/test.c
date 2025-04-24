#include <glog/logging.h>
#include <iostream>
#include <memory>
int main(int argc, char* argv[])
{
  google::InitGoogleLogging(argv[0]);
  LOG(INFO) << "test";
}