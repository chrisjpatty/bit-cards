import React from "react";
import styled from "react-emotion";
import excelImageSrc from "../img/excel-cards.svg"
import { UploadCloud, PlusIcon } from '../Icons'
import Papa from 'papaparse';

export default ({ wrapperProps, onUploaded, onRequestClose }) => {
  const [canDrop, setCanDrop] = React.useState(false)

  const preventDrop = e => {
    if(e) e.preventDefault();
  }

  const hideDroppableIndicator = e => {
    preventDrop(e)
    setCanDrop(false)
  }

  const showDroppableIndicator = e => {
    preventDrop(e)
    setCanDrop(true)
  }

  React.useEffect(() => {
    window.addEventListener("dragover", showDroppableIndicator, false);
    window.addEventListener("drop", hideDroppableIndicator, false);

    return () => {
      window.removeEventListener("dragover", showDroppableIndicator, false);
      window.removeEventListener("drop", hideDroppableIndicator, false);
    }
  }, [])

  const handleUpload = file => {
    const reader = new FileReader();
    reader.onload = e => {
      const csv = e.target.result;
      const json = Papa.parse(csv)
      onUploaded(json.data)
      onRequestClose()
    }
    reader.readAsText(file);
  }

  const handleDrop = e => {
    e.preventDefault()
    let files = [];
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      if (e.dataTransfer.items[i].kind === 'file') {
        const file = e.dataTransfer.items[i].getAsFile();
        if(file) files.push(file);
      }
    }
    const file = files[0]
    handleUpload(file)
  }

  const handleUploadChange = e => {
    handleUpload(e.target.files[0])
  }

  return (
    <Positioner>
      <Wrapper {...wrapperProps}>
        <InnerWrapper>
          <ExitButton onClick={onRequestClose}>
            <PlusIcon/>
          </ExitButton>
          {/* <ModalTitle>Upload CSV</ModalTitle> */}
          <Description>
            To generate cards from a CSV file, format your file with two columns and no headers like below. Be advised, this will replace all of the current cards.
          </Description>
          <ExcelImage src={excelImageSrc} />
          <UploadLabel onDrop={handleDrop} htmlFor="csv-upload-input">
            <HiddenInput type="file" id="csv-upload-input" accept=".csv" onChange={handleUploadChange} />
            <UploadCloud className={canDrop ? 'droppable-animation' : ''} />
            <Column>
              <LabelTop>Drop a file or click to upload</LabelTop>
              <Subtitle>.csv only</Subtitle>
            </Column>
          </UploadLabel>
        </InnerWrapper>
      </Wrapper>
    </Positioner>
  );
};

const Positioner = styled("div")({
  width: 1,
  height: 1,
  position: "fixed",
  left: "50%",
  top: "50%",
  background: "red",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

const Wrapper = styled("div")({
  width: "calc(100vw - 40px)",
  maxWidth: 600
});

const InnerWrapper = styled("div")({
  width: "calc(100vw - 40px)",
  maxWidth: 600,
  padding: 30,
  borderRadius: 8,
  background: "#fff",
  display: "flex",
  flexDirection: "column"
}, ({theme}) => ({
  boxShadow: theme.shadows.high
}));

// const ModalTitle = styled("h2")({
//   fontSize: 18,
//   margin: 0
// })

const Description = styled("p")(({theme}) => ({
  color: theme.gray.mediumDark,
  margin: 0,
  marginBottom: 15,
  lineHeight: 1.4
}))

const ExcelImage = styled("img")({
  width: "80%",
  alignSelf: "center"
}, ({theme}) => ({
  [theme.media.xs]: {
    width: "100%"
  }
}))

const UploadLabel = styled("label")(({theme}) => ({
  padding: '15px 30px',
  paddingLeft: 40,
  paddingRight: 15,
  borderRadius: 16,
  border: `dashed 4px ${theme.gray.extraLight}`,
  display: "flex",
  alignItems: "center",
  color: theme.gray.light,
  '& svg': {
    width: 80,
    marginTop: 8,
    fill: theme.gray.extraLight,
    flex: "0 0 auto",
    pointerEvents: "none"
  },
  '&:hover': {
    background: '#f3f3f3'
  },
  [theme.media.xs]: {
    paddingLeft: 20,
    '& svg': {
      width: 70,
      marginRight: 10
    }
  }
}))

const Column = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  flex: '1 1 auto',
  pointerEvents: "none"
})

const LabelTop = styled("span")({
  fontSize: 24,
  marginBottom: 5
}, ({theme}) => ({
  [theme.media.xs]: {
    fontSize: 20
  }
}))

const Subtitle = styled("span")({
  fontSize: 18,
  fontWeight: 600
})

const ExitButton = styled("button")({
  position: "absolute",
  width: 44,
  height: 44,
  right: -15,
  top: -15,
  background: '#ffffff',
  padding: 10,
  border: 'none',
  borderRadius: "100%"
}, ({theme}) => ({
  boxShadow: theme.shadows.mid,
  border: `1px solid ${theme.gray.extraExtraLight}`,
  '& svg': {
    fill: theme.gray.light,
    transform: "rotate(45deg)"
  },
  '&:hover': {
    background: theme.gray.extraExtraLight
  }
}))

const HiddenInput = styled("input")({
  width: 1,
  height: 1,
  position: "absolute",
  opacity: .01,
  color: 'transparent',
  background: "none"
})
