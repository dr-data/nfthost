import React, { useRef } from "react"
import { Card, CardContent, Typography, IconButton, List, ListItem, ListItemText, Avatar } from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CodeIcon from '@mui/icons-material/Code';
import ScriptDialog from "./ScriptDialog"
import style from "../../../styles/LayersContainer.module.scss"

const LayerContainer = ({alertRef, layerList, layerIndex, setLayerList, setLayerIndex}) => {
    const scriptDialogRef = useRef();

    const onAddLayer = () => {
        if (layerList.length >= 6) return;
        const newLayer = {
            name: "New Layer",
            images: []
        }
        setLayerList([...layerList, newLayer]);
        setLayerIndex(layerList.length);
    }

    const onClick = (index) => {
        setLayerIndex(index);
    }

    const onDelete = (index) => {
        if (layerList.length == 1) {
            alertRef.current.handleOpen("error", "You cannot delete the first layer");
            return;
        }
        let newLayerList = [...layerList];
        newLayerList.splice(index, 1);
        setLayerList(newLayerList);
        setLayerIndex(layerList.length - 2);
    }

    const onTitleChange = (e) => {
        let newLayerList = [...layerList];
        newLayerList[layerIndex].name = e.target.value;
        setLayerList(newLayerList);
    }

    const onScript = (e) => {
        e.stopPropagation();
        scriptDialogRef.current.handleOpen();
    }

    return (
        <Card className={style.card}>
            <ScriptDialog 
                ref={scriptDialogRef}
                alertRef={alertRef}
                layerList={layerList} 
                setLayerList={setLayerList}
            />
            <CardContent className={style.cardContent}>
                <Typography variant="h6" gutterBottom>
                    Layers
                </Typography>
                <List sx={{ paddingBottom: 0 }}>
                    <ListItem button className={style.layerItemFalse} onClick={onAddLayer}>
                        <Avatar>
                            <AddIcon />
                        </Avatar>
                        <ListItemText
                            sx={{ ml: 2 }}
                            primary={"Add Layer"}
                            secondary={`Layers ${layerList.length}`}
                        />
                        <IconButton onClick={onScript}>
                            <CodeIcon />
                        </IconButton>
                    </ListItem>
                {layerList.map((layer, idx) => (
                    <ListItem key={idx} button className={layerIndex == idx ? style.layerItemTrue : style.layerItemFalse} onClick={() => onClick(idx)}>
                        <Avatar style={{ backgroundColor: "rgb(242,80,34)" }}>
                            <LayersIcon />
                        </Avatar>
                        <ListItemText
                            sx={{ ml: 2 }}
                            primary={<input type="text" className={style.layerTitleInput} value={layer.name} onChange={onTitleChange} />} 
                            secondary={`${layer.images.length} Images`}
                        />
                        <IconButton onClick={(e) => {
                            e.stopPropagation(); 
                            onDelete(idx);
                        }}>
                            <CloseIcon />
                        </IconButton>
                    </ListItem>
                ))}
                </List>
            </CardContent>
        </Card>
    )
}

export default LayerContainer