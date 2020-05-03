import React from 'react';
import trans_conf from '../../assets/json/lang_config.json';

export const LangPopup =  (props) => {
    //console.log(props);
    let selectLangClass = 'hide';
    
    let selectedTrans;
    let defaultTrans;
    let filteredLangs = trans_conf; // filteredTrans();
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