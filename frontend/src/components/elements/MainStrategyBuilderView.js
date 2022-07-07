import React,{ useEffect, useState, useRef } from 'react';
import { BlocklyWorkspace, useBlocklyWorkspace } from 'react-blockly';
import  ConfigFiles  from "../../components/blocklycontent/content";
import "./styles/MainStrategyBuilderViewStyles.css";
import DarkTheme from '../../Blocky/theme.js';
import "../../Blocky/blocks/customblocks";
import Blockly from "blockly";

export default function MainStrategyBuilderView(props) {
  const { initXML, blocklyXML, setBlocklyXMLChange, setBlocklyJavascriptChange } = props;
  // const [currentXML, setCurrentXML] = useState('');

  const setXmlData = () => {

    const xmlDom = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToPrettyText(xmlDom);

    Blockly.JavaScript.addReservedWords('code');
    const code = Blockly.JavaScript.workspaceToCode(workspace);

    if (blocklyXML !== xmlText) {
      // setCurrentXML();
      setBlocklyXMLChange(xmlText);
      setBlocklyJavascriptChange(code);
    }
  }

  const blocklyRef = useRef(null);
  const { workspace, xml } = useBlocklyWorkspace({
    ref: blocklyRef,
    toolboxConfiguration: ConfigFiles.INITIAL_TOOLBOX_JSON, // this must be a JSON toolbox definition
    initialXml: initXML,
    workspaceConfiguration: { theme : DarkTheme },
    onWorkspaceChange: setXmlData
  });

  const reloadBlockly = () => {
    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(initXML), workspace);
  }

  // const generateJavascript = (xml) => {
  //   Blockly.JavaScript.addReservedWords('code');
  //   const code = Blockly.JavaScript.workspaceToCode(workspace);

  //   console.log("code in script", code);
  // }

  useEffect(() => {
    if (workspace && typeof initXML === 'string') reloadBlockly();
  }, [initXML]);

  return (
    <div style={{border:'none', width:'1000px'}}>
    {/* // <BlocklyWorkspace
    //   className="workarea"
    //   toolboxConfiguration={ConfigFiles.INITIAL_TOOLBOX_JSON}
    //   initialXml={blocklyXML}

    //   workspaceConfiguration={{theme : DarkTheme}}

    //   onXmlChange={setXmlData}

    // /> */}
    <div ref={blocklyRef} style={{ height: '500px' }} />
    </div>
  )
}
