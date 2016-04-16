#include <nan.h>
#include <cstdio>
#include <cstdlib>
#include <set>

#include "partialname.h"
#include "problem.h"

using namespace std;

ProblemPool *pool;
int maxReturnSize;

NAN_METHOD(Match) {
  if (info.Length() < 1) {
    Nan::ThrowError("Wrong number of arguments");
    return;
  }

  Nan::MaybeLocal<v8::String> maybeStr = Nan::To<v8::String>(info[0]);
  v8::Local<v8::String> str;
  if (!maybeStr.ToLocal(&str)) {
    Nan::ThrowTypeError("Error converting first argument to string");
    return;
  }

  set<string> insertedProblemsSet;
  v8::Local<v8::Array> insertedElementsArray = v8::Local<v8::Array>::Cast(info[1]);
  for (unsigned int i = 0; i < insertedElementsArray->Length(); i++) {
    v8::Local<v8::String> elem =
      v8::Local<v8::String>::Cast(insertedElementsArray->Get(i));
    insertedProblemsSet.insert(*v8::String::Utf8Value(elem));
  }

  PartialName *pn = new PartialName(*v8::String::Utf8Value(str));
  info.GetReturnValue().Set(pool->FindMatches(pn, insertedProblemsSet));
}

NAN_METHOD(SetReturnSize) {
  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError("Argument is not a number");
    return;
  }
  pool->SetMaxReturnSize(info[0]->NumberValue());
}

NAN_METHOD(AddProblem) {
  if (info.Length() != 3) {
    Nan::ThrowError("Wrong number of arguments");
    return;
  }

  Nan::MaybeLocal<v8::String> maybeFullName = Nan::To<v8::String>(info[0]);
  Nan::MaybeLocal<v8::String> maybeId = Nan::To<v8::String>(info[1]);
  Nan::MaybeLocal<v8::String> maybeUrl = Nan::To<v8::String>(info[2]);

  v8::Local<v8::String> fullName, id, url;
  if (!maybeFullName.ToLocal(&fullName) || !maybeId.ToLocal(&id) || !maybeUrl.ToLocal(&url)) {
    Nan::ThrowError("Error converting parameters to string");
    return;
  }

  pool->AddProblem(
    *v8::String::Utf8Value(fullName),
    *v8::String::Utf8Value(id),
    *v8::String::Utf8Value(url)
  );
}

NAN_MODULE_INIT(Init) {
  pool = new ProblemPool();
  Nan::Set(target, Nan::New("match").ToLocalChecked(),
      Nan::GetFunction(Nan::New<v8::FunctionTemplate>(Match)).ToLocalChecked());
  Nan::Set(target, Nan::New("setReturnSize").ToLocalChecked(),
      Nan::GetFunction(Nan::New<v8::FunctionTemplate>(SetReturnSize)).ToLocalChecked());
  Nan::Set(target, Nan::New("addProblem").ToLocalChecked(),
      Nan::GetFunction(Nan::New<v8::FunctionTemplate>(AddProblem)).ToLocalChecked());
}

NODE_MODULE(myaddon, Init);
