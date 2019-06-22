import React from 'react';

import Langs from '../../assets/json/langs.json';
//import Popup from "reactjs-popup";

const chkTrans = {'english': false, 'malayalam' : false};
const filteredLangs = Langs.filter(item => item.code === 'en' || item.code === 'ml' );
let popupStatus = false ;
let selectedTrans = '';
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

    let selectLang = evt => {
        //const refreshData = props.refreshData;
        console.log(evt.target);
        let lng = evt.target.value; //getAttribute('data-value');
        let eng = chkTrans.english;
        let mal = chkTrans.malayalam;
        switch (lng){
        case 'en':
            eng = true; //!eng;
            mal = false;
            
            break;
        case 'ml':
            mal = true; //!mal;
            eng = false;
            break;
        default:
        }
        //this.setState({
        props.translations.english = eng;
        props.translations.malayalam = mal; 
        popupStatus = false;
        //setPopupStatus(false);
        
        selectedTrans = findLang(Langs,lng);
        props.processData();
        selectLangClass = 'hide';
        console.log(popupStatus);
    }

      let showSelectLang = () => {
          selectLangClass = 'show';
      }

      return  <div className='lang-select'>
        <section className='select-value-wrapper'>
            <label onClick={showSelectLang}>Translation: <span>{selectedTrans.nativeName ? selectedTrans.nativeName : 'None'}</span></label>
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

    //const langPopupOpen = props.langPopupOpen;
    //const onLangChange = props.onSelectLang;
    const chkTrans = props.translations;
    const inputVal = props.inputVal;
    //const onPopupOpen = props.langPopupOnOpen;

    var nextBtnText = 'Next';
    var backBtnClass = navBackClass;
    var backBtnText = 'Back';
//console.log(props.details.ayahNumber);
    //const filteredLangs = Langs.filter(item => item.code === 'en' || item.code === 'ml' );

    if(!inputVal){
        nextBtnText = 'First Ayah';
        backBtnText = ' ';
        backBtnClass += ' off';
    } 
    /*<a href="javascript:;" 
                    className={backBtnClass} 
                    data-value="back" 
                    onClick={navBack}
                >
                <a href="javascript:;" 
                    className={navNextClass} 
                    data-value="next" 
                    onClick={navNext}
                >
                */

    return(
        <section className="titles-wrapper">
            <h2 className="surah-title">{selectedSurah.englishName} | {selectedSurah.name}</h2>
            
            <p>{selectedSurah.englishNameTranslation}</p>
            
            
            { props.details && 
                <p>Holy Qur'an Ayah No: <span className="clearer">{props.details.ayahNumber}</span> / 60236</p>
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
                translations={chkTrans} 
            />
        </section>
    )
}
export default SurahInfo;