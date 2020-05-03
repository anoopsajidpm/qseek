export function StringExtract(url_param) {
// --- extract surah & ayah numbers from url string
    console.log(url_param);
    let url_string = '';
    
    let str_split = [];
    let valid;
    if (url_param) {
      url_param = String(url_param).replace('?', '');
      str_split = url_param.split(':'); // if -> ?<surahnumber>:<ayahnumber>
      if (str_split.length > 1) {
        str_split.map(str => {
          if (Number(str)) {
            valid = true;
          } else {
            valid = false;
          }
        });
        if (valid) {
          url_string = url_param;
        }
      } else {
        str_split = url_param.split('&'); // if -> ?surah=<num>&ayah=<num>
        let res = [];
        if (str_split.length > 1) { // if param has 2 parts
          str_split.map(str => {
            let parts = str.split('='); // e.g: foo='bar'
            if (parts.length === 2) { // if <search>=<value>
              if (Number(parts[1])) {
                res.push(parts[1]);
              }
            } else {
              if (Number(parts[0])) {
                res.push(parts[0]);
              }
            }
          });
          url_string = String(res).replace(',', ':');
        } else { // if param has only 1 part
          let parts = str_split[0].split('='); // e.g: foo='bar'
          if (parts.length === 2) { // if <search>=<value>
            if (Number(parts[1])) {
              url_string = parts[1];
            }
          } else {
            if (Number(parts[0])) {
              url_string = parts[0];
            }
          }
        }

      }

    }
    return url_string
  }