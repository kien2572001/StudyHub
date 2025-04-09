import express from 'express';
import { DeckController } from '../controllers/deck.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const deckController = new DeckController();
const authMiddleware = new AuthMiddleware();

// CRUD routes for decks
router.post('/',authMiddleware.authenticate, deckController.createDeck);
router.get('/:id',authMiddleware.authenticate, deckController.getDeck);
router.get('/',authMiddleware.authenticate, deckController.getUserDecks);
router.put('/:id',authMiddleware.authenticate, deckController.updateDeck);
router.delete('/:id',authMiddleware.authenticate, deckController.deleteDeck);

export default router;
