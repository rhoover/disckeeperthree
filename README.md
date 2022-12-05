# Keeping Score of Your Disc Golf Disasters for Generations

  [if you throw, give it a whirl here](https.disckeeper.io)

  The latest generation of DiscKeeper web applications. A rather long history of iterations, but this one is quite different.

  All previous iterations have been entirely front-end javascript, meaning that if the language was disabled on the client device, poof!, no web app. If the connection was lousy or the device slow or ovewrworked, poof!, a lousy user experience.

  This newest version of the web app is what code nerds refer to as a statically generated site. It's an old, old concept with a ton of modern trimmings. Specifically, this was built using the Eleventy Static Site Generator.

  The end user receives .html pages, ready to display without any tomfoolery. Super fast, super simple. Most of the javascript for user interactions has been minified and in-lined, again for instant use, no messing around, and absolutely minimal network traffic.

  Speaking of network traffic, thanks to a service worker implementation, this network work is even further reduced as the user navigates around the app. Off-line capable baby!

  And the magical user-created scoring at the heart of this? Off-line capable thanks to an IndexedDB implementation.
