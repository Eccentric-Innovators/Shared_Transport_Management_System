# Node.js files

This folder contains the Node.js project files for the backend as well as front end of the server.

* **transport_system**
  The first Node.js code that was made to get the GPS values through MQTT and show them as such on the front end.

* **post_http**
  A test code to check the reception of HTTP POST messages containing GPS data being received and displayed on the front end.

* **GMaps_Tracking**
  A front end test code to check the working of Google Maps JavaScript API.

* **GPS_Maps**
  The final Node.js server code that contains all of the following features:
  * Hosting the front end with Google Maps JavaScript API
  * Running the Node.js backend which serves the front end HTML file, accepts GPS data through POST method, sends regular coordinate updates to front end, maintains driver, passenger and vehicle info
  * *Mongoose* schema for the databases for vehicles, drivers, passengers and the statistics (GPS data).
  * Contains the SSL certificate in order to provide secure connection through HTTPS
  More details on each of the files and folders of the project is given in the ReadMe inside the folder.