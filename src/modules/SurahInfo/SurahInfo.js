import React, {useState} from 'react';

import Langs from '../../assets/json/langs.json';
import trans_conf from '../../assets/json/lang_config.json';
//import Popup from "reactjs-popup";

var chkTrans = {}; // = {'english': false, 'malayalam' : false};

let filteredLangs ; //Langs.filter(item => item.code === 'en' || item.code === 'ml' );
let defaultTrans = undefined;
let popupStatus = false ;


let filteredTrans = () => {
    let res = [];
    
    let test = {};
    console.log(trans_conf);
    trans_conf.map(lng => {
        let temp = Langs.filter(item => item.code === lng.code)[0];
        res.push(temp);
        temp.active = lng.active; //)? true :false;
        
        /*if(Number(lng.active)){
            //setTrans(temp);
            selectedTrans = temp;
        }*/
    })
    //console.log(trans_active);
    //console.log(selectedTrans);
    return res;
}

let findLang = (array, title) => {
    let result = array.filter(item => item.code === title );
    if(result.length){
        return result[0];
    } else {
        return false;
    }
}



const LangPopup =  (props) => {
    //console.log(props);
    let selectLangClass = 'hide';
    //let [selectedTrans, setTrans] = useState(props.translations);

    //let selectedTrans = props.translations;
    //console.log(props.translations);
    let selectedTrans;
    filteredLangs = trans_conf; // filteredTrans();
    if(filteredLangs && filteredLangs.length){
        defaultTrans = filteredLangs.filter(item => item.active );
    }

    if(defaultTrans.length){
        //setTrans(defaultTrans[0]);
        selectedTrans = defaultTrans[0];
    } else {
        selectedTrans = undefined;
    }

    //console.log(selectedTrans);

    let selectLang = evt => {
        let lng = evt.target.value; //getAttribute('data-value');
        
        let temp = filteredLangs.filter(item => item.code === lng );

        if(temp.length){
            selectedTrans = {
                code: temp[0].code, 
                name: temp[0].name, 
                nativeName: temp[0].nativeName, 
                active: true
            };
        } else {
            selectedTrans = undefined;
        }

        props.onChange(selectedTrans);
    }

      let showSelectLang = () => {
          selectLangClass = 'show';
      }

      return  <div className='lang-select'>
        <section className='select-value-wrapper'>
            <label >Translation: 
                <span>
                    {props.translations && props.translations.nativeName ? ' ' + props.translations.nativeName : ' None'}
                </span>
            </label>

        </section>
        <select onChange={evt => selectLang(evt)} id='q-lang' className={selectLangClass} onClick={showSelectLang}>
            <option value="denied">None</option>
            {
                filteredLangs.map(lng=> 
                    <option value={lng.code} key={lng.code}>{lng.name} - {lng.nativeName}</option>
                )
            }
        
        </select>
       
    </div>
      
}

function SurahInfo (props) {
    //const details = props.details;
    const navBack = props.onNavBack;
    const selectedSurah = props.selectedSurah;
    //const transSelected = props.selectedLang;
    const navNext = props.onNavNext;
    const navNextClass = props.navNextClass;
    const navBackClass = props.navBackClass;
    const refreshData = props.refreshData;
    //selectedTrans = props.selectedTrans;
    
    //const langPopupOpen = props.langPopupOpen;
    //const onLangChange = props.onSelectLang;
    //chkTrans = props.translations;

    
    const inputVal = props.inputVal;
    //filteredLangs = props.filteredTrans;
    //const onPopupOpen = props.langPopupOnOpen;

    var nextBtnText = 'Next';
    var backBtnClass = navBackClass;
    var backBtnText = 'Back';

    if(!inputVal){
        nextBtnText = 'First Ayah';
        backBtnText = ' ';
        backBtnClass += ' off';
    } 


    return(
        <section className="titles-wrapper">
            <h2 className="surah-title"> {selectedSurah.name}</h2>
            
            <p><span className="clearer small">{selectedSurah.englishName}</span> | {selectedSurah.englishNameTranslation}</p>
            
            
            { props.details && 
                <p>Holy Qur'an Ayah No: <span className="clearer">{props.details.ayahNumber}</span> / 6236</p>
            }
            <div className="row-flex ayah-nav-wrapper margin top">
                
                <button className={backBtnClass} value="Back" data-value="back" onClick={navBack} >
                    {backBtnText}
                </button>
                    <p className="ayah-nav-text">Surah: <span className="clearer">{selectedSurah.number}</span> | Ayah: <span className="clearer">{inputVal ? inputVal : '---'}</span></p>
                <button className={navNextClass} value="Next" data-value="next" onClick={navNext} >
                
                    {nextBtnText}
                </button>
            </div>
            <LangPopup 
                processData={refreshData} 
                translations={props.selectedTrans}
                onChange={props.selectTrans}
            />
        </section>
    )
}
export default SurahInfo;