#include <nan.h>
#include <cstdio>
#include <cstdlib>
#include <set>

using namespace std;

class Problem {
  public:
    Problem(string, string, string);
    bool match(PartialName*);
    PartialName *m_name;
    string m_url, m_id;
};

Problem::Problem(string name, string id, string url) {
  m_name = new PartialName(name);
  m_id = id;
  m_url = url;
}

set<string> inserted;
bool Problem::match(PartialName *pn) {
  vector<uint16_t> &v = m_name->v;
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

class ProblemPool {
  public:
    ProblemPool();
    void AddProblem(string, string, string);
    void SetMaxReturnSize(int);
    v8::Local<v8::Array> FindMatches(PartialName*, set<string>);

  private:
    vector<Problem*> pool;
    int m_maxReturnSize = 16;
};

ProblemPool::ProblemPool() {}

void ProblemPool::SetMaxReturnSize(int maxReturnSize) {
  m_maxReturnSize = maxReturnSize;
}

void ProblemPool::AddProblem(string name, string id, string url) {
  Problem *p = new Problem(name, id, url);
  pool.push_back(p);
}

v8::Local<v8::Array> ProblemPool::FindMatches(PartialName *pn, set<string> inserted) {
  v8::Local<v8::Array> ret = Nan::New<v8::Array>();
  int sz = 0;
  for (auto p : pool) {
    if (p->match(pn) && !inserted.count(p->m_id)) {
      v8::Local<v8::Object> obj = Nan::New<v8::Object>();
      obj->Set(Nan::New("name").ToLocalChecked(), Nan::New(p->m_name->m_name).ToLocalChecked());
      obj->Set(Nan::New("id").ToLocalChecked(), Nan::New(p->m_id).ToLocalChecked());
      obj->Set(Nan::New("url").ToLocalChecked(), Nan::New(p->m_url).ToLocalChecked());
      ret->Set(sz++, obj);
      if (sz >= m_maxReturnSize) {
        break;
      }
    }
  }
  return ret;
}
