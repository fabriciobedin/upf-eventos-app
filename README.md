# UPF Eventos

## Instalation

### Android

```sh
yarn install   # to install dependencies
yarn android   # to run the app in Android
```

### iOS

```sh
yarn install                        # to install npm dependencies
cd ios && pod install && cd ..      # to install ios dependencies
yarn ios                            # to run the app in iOS
```
</br>

## Firebase setup

[Steps to configure](https://www.notion.so/137576/Steps-to-configure-Firebase-d8c4815abc024404964d77fd3b4ac677)

</br>

### Features used in [Firebase](https://console.firebase.google.com/u/0/)
* [Cloud Firestore](https://firebase.google.com/docs/firestore?authuser=5)
* [Cloud Functions](https://firebase.google.com/docs/functions?authuser=5)
* [Authentication](https://firebase.google.com/docs/auth?authuser=5)
* [Cloud Storage](https://firebase.google.com/docs/storage?authuser=5)

</br>

## Architecture

<img src="./docs/arquitetura.png" width="100%" />

### Features used in the app

* [React Native](https://reactnative.dev/)
* [React Hooks](https://pt-br.reactjs.org/docs/hooks-intro.html)
* [React Context](https://pt-br.reactjs.org/docs/context.html)
* [React Navigation](https://reactnavigation.org/)
* [Styled Components](https://styled-components.com/)
* [Unform](https://github.com/Rocketseat/unform)
* [Yup](https://github.com/jquense/yup)
* [React Native Image Picker](https://github.com/react-native-image-picker/react-native-image-picker)
* [React Native Camera](https://github.com/react-native-camera/react-native-camera)
* [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
* [React Native Async Storage](https://github.com/react-native-async-storage/async-storage)
* [React Native Masked View](https://github.com/react-native-masked-view/react-native-masked-view)
* [React Native iPhone X Helper](https://github.com/ptelad/react-native-iphone-x-helper)
* [React Native QRCode Scanner](https://github.com/moaazsidat/react-native-qrcode-scanner)
* [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)
* [React Native Screens](https://github.com/software-mansion/react-native-screens)
* [ESLint](https://eslint.org/)
* [Airbnb Styleguide](https://github.com/airbnb/javascript)
* [Prettier](https://prettier.io/)
* [EditorConfig](https://editorconfig.org/)
* [Jest](https://jestjs.io/)

</br>

## Screens

### Some interesting features of the login screens

- Scroll up automatically when the keyboard is visible.
- Change the keyboard layout for each input type.
- Each input has his own action in the last button of the keyboard, it could be go to the next input or submit the form.
- The icon inside the input changes the color when it's filled.
- The border color of the input changes when it's focused.

<div width="100%" align="center">
<img src="./.github/login-ios.png" width="33%" />
<img src="./.github/login-ios-input-email.png" width="33%" />
<img src="./.github/login-ios-input-scroll.png" width="33%" />
</div>
