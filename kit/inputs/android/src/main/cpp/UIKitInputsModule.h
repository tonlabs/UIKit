//
//  UIKitInputsModule.h
//  uikit.inputs
//
//  Created by Sergeev Anatolii on 20/06/2022
//

#pragma once

#include <NativeReanimatedModule.h>
#include "UIKitInputManager.h"

namespace tonlabs :: uikit {
using namespace facebook;
using namespace reanimated;

class JSI_EXPORT UIKitInputsModuleSpec : public TurboModule {
public:
    UIKitInputsModuleSpec(std::shared_ptr<CallInvoker> jsInvoker);

    virtual jsi::Object bind(const jsi::Value &reactTag) = 0;
};

class [[maybe_unused]] UIKitInputsModule : public UIKitInputsModuleSpec {
public:
    [[maybe_unused]] UIKitInputsModule(std::shared_ptr<CallInvoker> jsInvoker,
                      jsi::Runtime &rt,
 #ifdef __ANDROID__
                      jni::global_ref<UIKitInputManager::javaobject> javaInputsManager
 #elif __APPLE__
//     UIKitKeyboardFrameListener(UIKitKeyboardIosFrameListener *iosKeyboardFrameListener) : _iosKeyboardFrameListener(iosKeyboardFrameListener) {};
 #endif
 ) :
    UIKitInputsModuleSpec(jsInvoker),
    _jsInvoker(jsInvoker),
    _runtime(rt),
 #ifdef __ANDROID__
    _javaInputsManager(javaInputsManager)
 #endif
    {};

    jsi::Object bind(const jsi::Value &reactTag) override;
private:
    jsi::Runtime &_runtime;
 #ifdef __ANDROID__
    jni::global_ref<UIKitInputManager::javaobject> _javaInputsManager;
 #elif __APPLE__

 #endif
        std::shared_ptr<CallInvoker> _jsInvoker;
};

}
