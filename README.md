# expo-billang

an expense and bills management tracker application

## prerequisite

- [android studio](https://developer.android.com/)
- [node.js](https://nodejs.org/en)

## core features

- [react native](https://reactnative.dev/)
- [expo](https://expo.dev/)
- [nativewind](https://www.nativewind.dev/)
- [typescript](https://www.typescriptlang.org/)
- [lucide-react-native](https://lucide.dev/guide/packages/lucide-react-native)
- [eslint & prettier](https://docs.expo.dev/guides/using-eslint/)

## added features

- drizzle orm + sqlite

## billang features

- [ ] firebase (auth, realtime db)

## for developers

### install dependencies

```bash
npm install
```

### build production

```bash
eas login # login your account
eas build --profile production
```

### developer production

```bash
# start the developer server
npm start

# prebuild developer build
npx expo prebuild
npx expo run:android
```

### drizzle-kit

```bash
npx drizzle-kit generate

# drizzle-studio
key: shift + m
```

### analyzing code for potential errors or debugging

```bash
npx expo lint
npx expo-doctor
```

### references

[setup environment](https://docs.expo.dev/get-started/set-up-your-environment/)
[expo-icons](https://icons.expo.fyi/)
