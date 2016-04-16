#include <nan.h>
#include <cstdio>
#include <cstdlib>
#include <set>

using namespace std;

class PartialName {
  public:
    PartialName(string);
    vector<uint16_t> v;
    string m_name;

  private:
    void fix();
};

void PartialName::fix() {
  v = vector<uint16_t>();
  for (int i = 0; i < (int)m_name.size(); i++) {
    unsigned char c = (unsigned char) m_name[i];
    if (c >= 128) {
      i++;
      unsigned char c2 = (unsigned char) m_name[i];
      v.push_back(((c << 8) + c2)|0x20);
    } else {
      v.push_back(c|0x20);
    }
  }
}

PartialName::PartialName(string name) {
  m_name = name;
  fix();
}
