const MailListener = require("mail-listener-next"),
      mysql = require('mysql'),
      mysql = require('mysql'),
      _ = require('underscore');


class mailParser {
    constructor() {
        this.pool = null;
        this.connect();
    }

    connect() {
        // Configure MySQL Pool
        // TODO: SET MYSQL CONFIG
        this.pool = mysql.createPool({
            connectionLimit: 10,
            host: 'localhost',
            user: 'tt_server',
            password: '#4$k3CdiHP2w',
            database: 'tt',
            multipleStatements: true
        });

        // Setup MailListener
        var mailListener = new MailListener({
            username: "mtss.ticketing@gmail.com",
            password: "george.wilson",
            host: "imap.gmail.com",
            port: 993, // imap port
            tls: true,
            connTimeout: 10000, // Default by node-imap
            authTimeout: 5000, // Default by node-imap,
            debug: console.log, // Or your custom function with only one incoming argument. Default: null
            tlsOptions: { rejectUnauthorized: false },
            mailbox: "INBOX", // mailbox to monitor
            searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
            fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
            mailParserOptions: { streamAttachments: false }, // options to be passed to mailParser lib.
            attachments: false, // download attachments as they are encountered to the project directory
            attachmentOptions: { directory: "attachments/" }, // specify a download directory for attachments
            // to make server respond to other requests you may want
            // to pause for 'fetchingPauseTime' fetching of the email, because it 'hangs' your app
            fetchingPauseThreshold: null, // amount bytes
            fetchingPauseTime: 5000 // ms to pause fetching and process other requests
        });

        // Connect
        mailListener.start();

        // Set MailListener Listeners
        mailListener.on("server:connected", function () {
            console.log("imapConnected");
        });
        mailListener.on("server:disconnected", function () {
            console.log("imapDisconnected");
            setInterval(function() {
                mailListener.start();
            }, 3000);
        });
        mailListener.on("error", function (err) {
            console.log(err);
        });
        mailListener.on("mail", function (mail, seqno, attributes) {
            let status = this._checkIssueExist(mail);
            if(status && status !== "closed") {
                // If
            } else if(status === "closed") {
                // Send back email that status is closed
            }
        });
    }
    // Returns current status, or NULL
    _checkIssueExist(mail) {
        // Email Subject Template: {ISSUENUMBER}-{STATUS}
        let sub = mail.subject.split("-");
        this.pool.getConnection(function (err, connection) {
            connection.query("", function (error, results) {
                connection.release();
                if (error) throw error;
                if(results) {
                    var results = JSON.parse(results);
                    return results.status; //Status returned here TODO:
                } else {
                    return null;
                }
            });
        });

    }
}
