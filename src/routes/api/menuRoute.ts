import express, { Request, Response } from 'express';
import {MenuController} from "../../controllers/MenuController";
import {IMenuCreation} from "../../types/IMenu";

const router = express.Router();
router.post('/', async (req: Request<{}, {}, IMenuCreation>, res: Response) => {
    try {
        const menuData = req.body;
        const newMenu = await MenuController.createMenu(menuData);
        res.status(201).json(newMenu);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors de la création du menu', error: (error as Error).message });
    }
});
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const menu = await MenuController.getMenuById(id);
        if (menu) {
            res.status(200).json(menu);
        } else {
            res.status(404).json({ message: `Menu avec l'ID ${id} non trouvé.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du menu', error: (error as Error).message });
    }
});
router.put('/:id', async (req: Request<{ id: string }, {}, IMenuCreation>, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        const menuData = req.body;
        const updatedMenu = await MenuController.updateMenu(id, menuData);
        res.status(200).json(updatedMenu);
    } catch (error) {
        if ((error as Error).message.includes('non trouvé')) {
            res.status(404).json({ message: (error as Error).message });
        } else {
            res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du menu', error: (error as Error).message });
        }
    }
});
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const id = parseInt(req.params.id, 10);
        await MenuController.deleteMenu(id);
        res.status(204).send(); // 204 No Content pour une suppression réussie
    } catch (error) {
        if ((error as Error).message.includes('non trouvé')) {
            res.status(404).json({ message: (error as Error).message });
        } else {
            res.status(500).json({ message: 'Erreur serveur lors de la suppression du menu', error: (error as Error).message });
        }
    }
});

export default router;
