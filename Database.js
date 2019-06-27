import SQLite from "react-native-sqlite-storage";
import RNAccountKit from 'react-native-facebook-account-kit';
import CacheStore from 'react-native-cache-store';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "Reactoffline1.db";
const database_version = "1.0";
const database_displayname = "SQLite React Offline Database";
const database_size = 200000;

export default class Database {
    initDB() {
        let db;
        return new Promise((resolve, reject) => {
          console.log("Plugin integrity check ...");
          
          SQLite.echoTest()
            .then(() => {
              console.log("Integrity check passed ...");
              console.log("Opening database ...");
              SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
              )
                .then(DB => {
                  db = DB;
                  console.log("Database OPEN");
                  db.executeSql('SELECT 1 FROM Products LIMIT 1').then(() => {
                      console.log("Database is ready ... executing query ...");
                  }).catch((error) =>{
                      console.log("Received error: ", error);
                      console.log("Database not yet ready ... populating data");
                      db.transaction((tx) => {
                          tx.executeSql('CREATE TABLE IF NOT EXISTS users ( user_id integer PRIMARY KEY, phone_number text NOT NULL, created_date text, login_date text )');
                          tx.executeSql('CREATE TABLE IF NOT EXISTS category ( category_id integer PRIMARY KEY, name text, price text, img_local_url text )');
                          tx.executeSql('CREATE TABLE IF NOT EXISTS products ( product_id integer PRIMARY KEY, user_id integer NOT NULL, category_id integer, name text NOT NULL, price real NOT null, img_local_url, quantity integer, register_date, description, FOREIGN KEY (user_id) REFERENCES users(user_id) )');
                      }).then(() => {
                          console.log("Tables created successfully");
                      }).catch(error => {
                          console.log(error);
                          reject(error);
                      });
                  });
                  resolve(db);
                })
                .catch(error => {
                  console.log(error);
                  reject(error)
                });
            })
            .catch(error => {
              console.log("echoTest failed - plugin not functional");
              reject(error);
            });
          });
      };

      closeDatabase(db) {
        if (db) {
          console.log("Closing DB");
          db.close()
            .then(status => {
              console.log("Database CLOSED");
            })
            .catch(error => {
              this.errorCB(error);
            });
        } else {
          console.log("Database was not OPENED");
        }
      };

      listProduct() {
        return new Promise((resolve, reject) => {
          const products = [];
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT p.prodId, p.prodName, p.prodImage FROM Product p', []).then(([tx,results]) => {
                console.log("Query completed");
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  console.log(`Prod ID: ${row.prodId}, Prod Name: ${row.prodName}`)
                  const { prodId, prodName, prodImage } = row;
                  products.push({
                    prodId,
                    prodName,
                    prodImage
                  });
                }
                console.log(products);
                resolve(products);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
              reject(err);
            });
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        });  
      }


      productById(id) {
        console.log(id);
        return new Promise((resolve, reject) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT * FROM Product WHERE prodId = ?', [id]).then(([tx,results]) => {
                console.log(results);
                if(results.rows.length > 0) {
                  let row = results.rows.item(0);
                  resolve(row);
                }
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
              reject(err)
            });
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        });  
      }


      addProduct(prod) {
        return new Promise((resolve, reject) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO Product VALUES (?, ?, ?, ?, ?)', [prod.prodId, prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
              reject(err);
            });
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        });  
      }


      updateProduct(id, prod) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('UPDATE Product SET prodName = ?, prodDesc = ?, prodImage = ?, prodPrice = ? WHERE prodId = ?', [prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice, id]).then(([tx, results]) => {
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }


      deleteProduct(id) {
        return new Promise((resolve) => {
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('DELETE FROM Product WHERE prodId = ?', [id]).then(([tx, results]) => {
                console.log(results);
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
            });
          }).catch((err) => {
            console.log(err);
          });
        });  
      }

      onLoginError(e) {
        console.log('Failed to login', e)
      }

      FindUser(phoneNumber){
        return new Promise((resolve, reject) =>{
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql('SELECT * FROM users WHERE phone_number = ?', [phoneNumber]).then(([tx,results]) => {
                console.log(results);
                if(results.rows.length > 0) {
                  let row = results.rows.item(0);
                  console.log('User found. Result is: ', row)
                  resolve(row);
                } else {
                  resolve(null);
                }
              });
              
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
              reject(err)
            });
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        })
      }

      CreateUser(phoneNumber){
        return new Promise((resolve, reject) =>{
          this.initDB().then((db) => {
            db.transaction((tx) => {
              tx.executeSql("insert into users(phone_number, created_date, login_date) VALUES (?, DATETIME('now'), DATETIME('now'))", [phoneNumber]).then(([tx, results]) => {
                console.log('New user created. Result is: ', results)
                resolve(results);
              });
            }).then((result) => {
              this.closeDatabase(db);
            }).catch((err) => {
              console.log(err);
              reject(err)
            });
          }).catch((err) => {
            console.log(err);
            reject(err);
          });
        })
      }

      userLoggedIn() {
        return new Promise((resolve) => {
          //AccountKit config
          RNAccountKit.configure({ initialPhoneCountryPrefix: '+976', defaultCountry: 'MN'});

          RNAccountKit.loginWithPhone().then(async (token) => {
            if (!token) {
              console.log('Login cancelled')
              resolve('login cancelled');
            } else {
              RNAccountKit.getCurrentAccount().then((account) => {
                if(account) {
                  const phoneNumber = account.phoneNumber.number;
                  let userState = {}
                  this.FindUser(phoneNumber).then((data) => {
                    console.log('FindUser data is ', data);
                    if(data) {
                      userState = {
                        userId: data.user_id,
                        phoneNumber: phoneNumber
                      }
                      console.log('CacheStore set', userState);
                      CacheStore.set('userState', userState, 525600); // Expires in 1 year
                      console.log('account', account);
                      resolve(userState);
                    } else {
                      this.CreateUser(phoneNumber).then((data) => {
                        console.log('CreateUser data is ', data);
                        console.log('Insert id is :', data.insertId)
                        userState = {
                          userId: data.insertId,
                          phoneNumber: phoneNumber
                        }
                        console.log('CacheStore set', userState);
                        CacheStore.set('userState', userState, 525600); // Expires in 1 year
                        console.log('account', account);
                        resolve(userState);
                      })
                    }
                  })
                } else {
                  resolve('failed login')
                }
                }).catch((e) => {this.onLoginError(e);
                  resolve('failed login')
                })
            }
          }).catch((e) => {
            this.onLoginError(e)
            resolve('failed login')
          })
        })
      }
}