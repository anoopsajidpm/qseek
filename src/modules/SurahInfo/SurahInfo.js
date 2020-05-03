import React, {useState} from 'react';

import Langs from '../../assets/json/langs.json';
import trans_conf from '../../assets/json/lang_config.json';
import {LangPopup} from '../../components/LangPopup/LangPopup';
//import Popup from "reactjs-popup";

//var chkTrans = {}; // = {'english': false, 'malayalam' : false};

//let filteredLangs ; //Langs.filter(item => item.code === 'en' || item.code === 'ml' );
//let defaultTrans = undefined;
//let popupStatus = false ;


let filteredTrans = () => {
    let res = [];
    
    let test = {};
    console.log(trans_conf);
    trans_conf.map(lng => {
        let temp = Langs.filter(item => item.code === lng.code)[0];
        res.push(temp);
        temp.active = lng.active; //)? true :false;
        
    })
    
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



function SurahInfo (props) {
    

    const { inputVal, onNavBack, selectedSurah, onNavNext, navNextClass, navBackClass, refreshData} = props;
    
    
    //const inputVal = props.inputVal;
    

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
                
                <button className={backBtnClass} value="Back" data-value="back" onClick={onNavBack} >
                    {backBtnText}
                </button>
                    <p className="ayah-nav-text">Surah: <span className="clearer">{selectedSurah.number}</span> | Ayah: <span className="clearer">{selectedSurah.numberInSurah?selectedSurah.numberInSurah:'---'}</span></p>
                <button className={navNextClass} value="Next" data-value="next" onClick={onNavNext} >
                
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