import express, { Application, Request, Response } from "express";
import cors from "cors";
import { join, resolve } from 'path'
import fs, { Dirent } from "fs";
import { j } from 'vite/dist/node/types.d-aGj9QkWt'

class ServerExpress{
    private _app:Application
    private _port:number;
    private _files:string;

    /**
     *
     * @param port Porta para rodar o servidor
     * @param files Diretório de arquivos de downloads
     */
    constructor(port:number, files:string){
        this._port = port;
        this._app = express();
        this._files = files;
        this.usersExpress();
        this.routers();
    }

    private usersExpress():void{
        this._app.use(cors());
        this._app.use('/files', express.static(this._files));
        this._app.use('/icons', express.static(join(__dirname, '..','..','uploads','icons')));
    }

    private routers():void{

        this._app.get('/root', async (req:Request, res:Response) => {
            try {
                const absoluteDir = resolve(`${this._files}`);
                const entries:Dirent[] = await fs.readdirSync(absoluteDir, { withFileTypes: true });

                const directorys:Dirent[] = entries.filter((dir) => dir.isDirectory())
                res.status(200).json({ files:directorys, ok: true });
            } catch (error) {
                res.status(500).json({ files:[], ok: error });
            }
        });

        this._app.get('/downloads/:dir', async (req:Request, res:Response) => {
            const { dir:directory } = req.params;
            try {
                const absoluteDir = resolve(`${this._files}/${directory}`);
                const entries:Dirent[] = await fs.readdirSync(absoluteDir, { withFileTypes: true });

                const directorys:Dirent[] = entries.filter((dir) => dir.isDirectory())
                res.status(200).json({ files:directorys, ok: true });
            } catch (error) {
                res.status(500).json({ files:[], ok: error });
            }
        });

        this._app.get('/story/:dir/:story', async (req:Request, res:Response) => {
            const { dir:directory, story } = req.params;
            try {
                const absoluteDir = resolve(`${this._files}/${directory}/${story}`);
                const entries:Dirent[] = await fs.readdirSync(absoluteDir, { withFileTypes: true });

                const directorys:Dirent[] = entries.filter((dir) => dir.isDirectory())
                res.status(200).json({ files:directorys, ok: true });
            } catch (error) {
                res.status(500).json({ files:[], ok: error });
            }
        });

        this._app.get('/chapter/:dir/:story/:chapter', async (req:Request, res:Response) => {
            const { dir:directory, story, chapter } = req.params;
            try {
                const absoluteDir = resolve(`${this._files}/${directory}/${story}/${chapter}`);
                const entries:Dirent[] = await fs.readdirSync(absoluteDir, { withFileTypes: true });

                const directorys:Dirent[] = entries.filter((dir) => !dir.isDirectory())
                res.status(200).json({ files:directorys, ok: true });
            } catch (error) {
                res.status(500).json({ files:[], ok: error });
            }
        });

    }

    public start():void{
        this._app.listen(this._port, () => {
            console.log(`Aplicação rodando em http://localhost:${this._port}`);
        })
    }

}

export default ServerExpress;
