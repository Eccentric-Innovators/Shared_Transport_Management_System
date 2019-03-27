# Shared Transport Management System

A project aimed at managing transport systems of institutions.

## Goals:

- Tracking live vehicle location and displaying to boarders
- Collecting and analyzing driver statistics
- Streamlining boarding process by performing boarding check

## Implementation:

- Tracking vehicle location
- Reading RFID values using Arduino

The `Arduino` folder contains the ino files for the NodeMCU and Arduino boards for GPS, RFID and sending values to the server.

The `Node` folder contains the Node.js programs for hosting various servers. Multiple iterations were run, and all intermediate project files are also stored here.

The `MongoDB` folder contains a single folder called `data` in which all the databases are stored.

The `html_tests` folder is used only for testing various UI effects.

**All documentation for these project files can be found within the respective folders.**