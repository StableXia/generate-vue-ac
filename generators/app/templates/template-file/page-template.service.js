/*
 * File Created: 2018-09-12 1:22:51 pm
 * Author: xiawen
 * -----
 * Last Modified: 2018-09-12 1:28:55 pm
 * Modified By: xiawen
 * -----
 * Copyright (c) 2018 rongyi
 */

module.exports = {
  createPageTemplateModule(fileName) {
    return `
    <!DOCTYPE html>
      <html lang="en">
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${fileName}</title>
      </head>
      
      <body>
        <div id="app" class="ac-layout ac-layout--column">
          <div id="app-nav" class="ac-layout ac-layout--center-items"></div>
          <div id="app-main" class="ac-layout__flex">${fileName}</div>
        </div>
      </body>
    
    </html>
    `;
  }
}


