// regex_search example
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <cstdint>
#include <set>

using namespace std;

void fix(string &name, vector<uint16_t> &v) {
  for (int i = 0; i < name.size(); i++) {
    unsigned char c = (unsigned char) name[i];
    if (c >= 128) {
      i++;
      unsigned char c2 = (unsigned char) name[i];
      v.push_back(((c << 8) + c2)|0x20);
    } else {
      v.push_back(c|0x20);
    }
  }
}

class PartialName {
  public:
    PartialName(string);
    vector<uint16_t> v;
};

PartialName::PartialName(string name) {
  v = vector<uint16_t>();
  fix(name, v);
}

class Problem {
  public:
    Problem(string,string,string);
    bool match(PartialName*);
    vector<uint16_t> v;
    string m_name;
    string m_url, m_id;
};

Problem::Problem(string id, string name, string url) {
  m_name = name;
  m_url = url;
  m_id = id;
  v = vector<uint16_t>();
  fix(m_name, v);
}

set<string> inserted;
bool Problem::match(PartialName *pn) {
  vector<uint16_t> &v2 = pn->v;
  int lim_j = v2.size();
  int lim_i = v.size() - lim_j + 1;
  bool can;
  for (int i = 0; i < lim_i; i++) {
    can = true;
    for (int j = 0; j < lim_j; j++) {
      if (v[i+j] != v2[j]) {
        can = false;
        break;
      }
    }
    if (can) {
      return inserted.count(m_id) == 0;
    }
  }
  return false;
}

// We'll construct the JSON with `, because no problem name uses this character.
void printJson(vector<Problem*> &r) {
  bool ja=0;
  printf("[");
  for (auto *p : r) {
    if (ja) printf(",");
    else ja=1;
    printf("{`id`: `%s`, `name`: `%s`, `url`: `%s`}", p->m_id.c_str(), p->m_name.c_str(), p->m_url.c_str());
  }
  printf("]");
}

int main (int argc, char *argv[]) {
  string name, url, id;
  if (argc < 3) {
    printf("[]");
    return 0;
  }
  inserted = set<string>();
  for (int i = 3; i < argc; i++) {
    inserted.insert(string(argv[i]));
  }
  ifstream problemsFile(argv[2]);
  name = string(argv[1]);
  PartialName *pn = new PartialName(name);

  vector<Problem*> r = vector<Problem*>();
  if (problemsFile.is_open()) {
    while (getline(problemsFile, name)) {
      while (name.length() < 4 && getline(problemsFile, name));
      getline(problemsFile, url);
      while (url.length() < 4 && getline(problemsFile, url));
      getline(problemsFile, id);
      while (id.length() < 4 && getline(problemsFile, id));
      if (id.length() == 25) id.erase(id.begin());
      Problem* p = new Problem(id, name, url);
      if (p->match(pn)) {
        r.push_back(p);
        if (r.size() >= 16) break;
      }
    }
    problemsFile.close();
  }
  printJson(r);
  return 0;
}