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

## Configuração do Firebase

[Passos para configuração](https://www.notion.so/137576/Steps-to-configure-Firebase-d8c4815abc024404964d77fd3b4ac677)

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
