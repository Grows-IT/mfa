// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const siteUrl = 'http://203.150.199.148';
// const siteUrl: 'http://santaputra.trueddns.com:46921/moodle37',

export const environment = {
  production: false,
  siteUrl,
  webServiceUrl: siteUrl + '/webservice/rest/server.php?moodlewsrestformat=json',
  timeoutDuration: 20000,
  apiKey: '226a2f5caba8275e077de43c696171ee',
  newsCourseName: 'News and Update'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
