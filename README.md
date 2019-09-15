# Modern Farm Academy Mobile App
## Installation
Clone this repository and run
```
npm install
ionic serve
```
The browser will automatically open to http://localhost:8100

## Development setup
- In src/environments/environment.ts change the siteUrl to point to your own Moodle dev server.
## Build Android release APK
To build APK release you need to build the Ionic project and copy the files to www folder. Then you can build the APK using Android Studio. Follow these 2 steps.
### 1. Ionic project
```
ionic build --prod
ionic cap copy android
ionic cap open android
```

This will open the project in Android Studio. 

### 2. Android Studio
Let the gradle sync completes. 
> Note: If Gradle sync failed with the following error,
>
> `ERROR: Unable to find module with Gradle path ':capacitor-cordova-android-plugins' (needed by module 'app'.)`
>
> go to File > Invalidate Caches / Restart...

1. Go to Build' -> 'Generate Signed Bundle / APK
2. Choose 'APK', click Next
3. In Key store path choose "Create new". Fill in all the inputs then click OK
4. Back in Generate Signed Bundle or APK windows, click Next
5. In Build Variants choose release and click Finish
6. Once the build is finished, you can locate the file in MfaMobileApp⁩ ▸ ⁨android⁩ ▸ ⁨app⁩ ▸ ⁨release⁩
