'use strict';
import readline from 'readline';
import crypto from "crypto";
import fs from "fs";

var object = {};
var list = [];
object.list = list;

const algorithm = 'aes-192-cbc';
var password = "";
var crypt = "";
var filepath = "";
var platform = "";
var login = "";
var pass = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question0 = () => {
  return new Promise((resolve, reject) => {
    rl.question('Secret key: ', (answer) => {
      password = answer;
      resolve();
    });
  })
}

const question1 = () => {
  return new Promise((resolve, reject) => {
    rl.question('write 1 for encrypt or 2 for decrypt: ', (answer) => {
      crypt = answer;
      resolve();
    });
  })
}

const question2 = () => {
  return new Promise((resolve, reject) => {
    rl.question('filepath: ', (answer) => {
      filepath = answer;
      resolve();
    });
  })
}

const question3 = () => {
  return new Promise((resolve, reject) => {
    rl.question('platform: ', (answer) => {
      platform = answer;
      resolve();
    });
  })
}

const question4 = () => {
  return new Promise((resolve, reject) => {
    rl.question('login: ', (answer) => {
      login = answer;
      resolve();
    })
  })
}

const question5 = () => {
  return new Promise((resolve, reject) => {
    rl.question('pass: ', (answer) => {
      pass = answer;
      resolve();
    })
  })
}

const question6 = () => {
  return new Promise((resolve, reject) => {
    rl.question('file exists, overwrite? y or n: ', (answer) => {
      switch (answer) {
        case "Y":
        case "y":
          resolve();
          break;
        
        case "N":
        case "n":
          reject(); process.exit();
      
        default:
          reject(); process.exit();
      }
    })
  })
}

const main = async () => {
    console.info("\x1b[31m" +
    "######                       #     #" + "\n" +
    "#     #   ##    ####   ####  #     #   ##   #    # #      #####" + "\n" +
    "#     #  #  #  #      #      #     #  #  #  #    # #        #" + "\n" +
    "######  #    #  ####   ####  #     # #    # #    # #        #" + "\n" +
    "#       ######      #      #  #   #  ###### #    # #        #" + "\n" +
    "#       #    # #    # #    #   # #   #    # #    # #        #" + "\n" +
    "#       #    #  ####   ####     #    #    #  ####  ######   #" + "\x1b[0m");
    console.info(`version: ${process.env.npm_package_version}`);
    await question0();
    await question1();
    await question2();

    switch (crypt) {
      case "1":
        if (fs.existsSync(filepath)) {
          await question6();
        }
        await question3();
        await question4();
        await question5();
        rl.close();

        var list = {
          "platform": platform,
          "login": login,
          "pass": pass
        };

        object.list.push(list);
        console.info(object);

        crypto.scrypt(password, 'salt', 24, (err, key) => {
          if (err) throw err;

          crypto.randomFill(new Uint8Array(16), (err, iv) => {
            if (err) throw err;

            const cipher = crypto.createCipheriv(algorithm, key, iv);

            let encrypted = cipher.update("1234567890123456" + JSON.stringify(object), 'utf8', 'hex');
            encrypted += cipher.final('hex');

            try {
              fs.writeFileSync(filepath, encrypted);

              console.info("\x1b[32m" + "Successfully encrypted" + "\x1b[0m");
            } catch (err) {
              console.error("\x1b[31m" + err + "\x1b[0m");
            }
          });
        });
        break;

      case "2":
        try {
          var text = fs.readFileSync(filepath,'utf8');
        } catch (err) {
          console.error("\x1b[31m" + err + "\x1b[0m");
        }

        const key = crypto.scryptSync(password, 'salt', 24);
        const iv = Buffer.alloc(16, 0);

        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        const encrypted = text;
        try {
          let decrypted = decipher.update(encrypted, 'hex', 'utf8');
          decrypted += decipher.final('utf8');

          var res = JSON.parse(decrypted.substr(16));
          console.table(res.list);
        } catch (err) {
          console.error("\x1b[31m" + err + "\x1b[0m");
        }
        break;

      default:
        console.error("\x1b[31m Error \x1b[0m");
        break;
    }
}

main();
