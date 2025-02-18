const { join, dirname } = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
const { validationResult } = require('express-validator');
const { generateAccessToken } = require('../../middlewares/jwt');
const { NFTError } = require('../../middlewares/errorHandler');

exports.create = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new NFTError("Validation Error", 400);

        const {title, description, keywords, isRobot, language, image, iframe} = req.body;
        const id = uniqid();
        const content = `import style from "../styles/Host.module.scss"
        import { Typography } from "@mui/material";
        import MintContainer from "../components/MintContainer";
        import Header from "../components/Header"  
        const ${id} = () => {
            return (
                <div className={style.hostFrame}>
                    <Header 
                        title="${title}"
                        description="${description}"
                        keywords="${keywords}"
                        robots={${isRobot}}
                        language="${language}"
                        image="${image}"
                    />
                    <div className={style.hostContainer}>
                        <img src="${image}" alt="NFT Host Logo" />
                        <Typography variant="h2" component="div">
                            ${title}
                        </Typography>
                        <Typography variant="body1">
                            ${description}
                        </Typography>
                        <MintContainer 
                            iframe="${iframe}"
                        />
                    </div>
                </div>
            )
        }  
        export default ${id}`;

        const url = req.protocol + '://localhost:3000' + `/${id}`;

        fs.writeFile(join(dirname(require.main.filename), `/pages/${id}.js`), content, err => {
            if (err) throw new NFTError(err.message, 400);
            const data = { url: url };
            const accessToken = generateAccessToken(data);
            res.json({ accessToken: accessToken });
        });

    } catch (err) {
        next(err);
    }
}

exports.delete = (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) throw new NFTError("Validation Error", 400);

        const { url } = req.body;
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        fs.unlink(join(dirname(require.main.filename), `/pages/${fileName}.js`), (err) => {
            if (err) throw new NFTError(err.message, 400);
            res.sendStatus(200);
        })
    } catch (err) {
        next(err);
    }
}