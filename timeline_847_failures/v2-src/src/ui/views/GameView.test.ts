/**
 * GameView Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameView } from './GameView.ts';
import { EventBus } from '../../core/EventBus.ts';
import type { DialogEntry, Choice } from '../../core/index.ts';

describe('GameView', () => {
  let view: GameView;
  let bus: EventBus;

  beforeEach(() => {
    document.body.innerHTML = '';
    bus = new EventBus();
  });

  afterEach(() => {
    view?.destroy();
  });

  describe('creation', () => {
    it('should create game view with all layers', () => {
      view = new GameView({ eventBus: bus });
      view.mount(document.body);

      expect(view.getElement().querySelector('.uv7-game__background')).not.toBeNull();
      expect(view.getElement().querySelector('.uv7-game__characters')).not.toBeNull();
      expect(view.getElement().querySelector('.uv7-game__dialog')).not.toBeNull();
      expect(view.getElement().querySelector('.uv7-game__choices')).not.toBeNull();
    });
  });

  describe('background', () => {
    beforeEach(() => {
      view = new GameView({ eventBus: bus });
      view.mount(document.body);
    });

    it('should set background image', () => {
      view.setBackground('/bg/room.jpg');

      const bg = view.getElement().querySelector('.uv7-game__background') as HTMLElement;
      expect(bg.style.backgroundImage).toContain('room.jpg');
    });

    it('should clear background', () => {
      view.setBackground('/bg/room.jpg');
      view.clearBackground();

      const bg = view.getElement().querySelector('.uv7-game__background') as HTMLElement;
      expect(bg.style.backgroundImage).toBe('');
    });
  });

  describe('characters', () => {
    beforeEach(() => {
      view = new GameView({ eventBus: bus });
      view.mount(document.body);
    });

    it('should show character', () => {
      view.showCharacter('ronnie', 'happy', 'left');

      const char = view.getElement().querySelector('[data-character="ronnie"]');
      expect(char).not.toBeNull();
      expect(char?.classList.contains('uv7-game__character--left')).toBe(true);
    });

    it('should set character emotion', () => {
      view.showCharacter('ronnie', 'neutral');
      view.setCharacterEmotion('ronnie', 'sad');

      const char = view.getElement().querySelector('[data-character="ronnie"]') as HTMLElement;
      expect(char.dataset.emotion).toBe('sad');
    });

    it('should hide character', () => {
      view.showCharacter('ronnie');
      view.hideCharacter('ronnie');

      const char = view.getElement().querySelector('[data-character="ronnie"]');
      expect(char).toBeNull();
    });

    it('should clear all characters', () => {
      view.showCharacter('ronnie', 'neutral', 'left');
      view.showCharacter('tori', 'happy', 'right');
      view.clearCharacters();

      const chars = view.getElement().querySelectorAll('.uv7-game__character');
      expect(chars).toHaveLength(0);
    });

    it('should replace existing character on show', () => {
      view.showCharacter('ronnie', 'neutral', 'left');
      view.showCharacter('ronnie', 'happy', 'right');

      const chars = view.getElement().querySelectorAll('[data-character="ronnie"]');
      expect(chars).toHaveLength(1);
    });
  });

  describe('dialog', () => {
    const testEntry: DialogEntry = {
      speaker: 'ronnie',
      text: 'Hello there!',
    };

    beforeEach(() => {
      view = new GameView({ eventBus: bus });
      view.mount(document.body);
    });

    it('should show dialog', () => {
      view.showDialog(testEntry);

      const dialog = view.getElement().querySelector('.uv7-game__dialog');
      expect(dialog?.classList.contains('uv7-game__dialog--visible')).toBe(true);
    });

    it('should set speaker name', () => {
      view.showDialog(testEntry);

      const speaker = view.getElement().querySelector('.uv7-game__speaker');
      expect(speaker?.textContent).toBe('Ronnie');
    });

    it('should format narrator as empty', () => {
      view.showDialog({ speaker: 'narrator', text: 'Something happened.' });

      const speaker = view.getElement().querySelector('.uv7-game__speaker');
      expect(speaker?.textContent).toBe('');
    });

    it('should update dialog text', () => {
      view.showDialog(testEntry);
      view.setDialogText('Hello');

      const text = view.getElement().querySelector('.uv7-game__text');
      expect(text?.textContent).toBe('Hello');
    });

    it('should hide dialog', () => {
      view.showDialog(testEntry);
      view.hideDialog();

      const dialog = view.getElement().querySelector('.uv7-game__dialog');
      expect(dialog?.classList.contains('uv7-game__dialog--visible')).toBe(false);
    });

    it('should respond to dialog:show event', () => {
      bus.emit('dialog:show', { entry: testEntry, index: 0 });

      const dialog = view.getElement().querySelector('.uv7-game__dialog');
      expect(dialog?.classList.contains('uv7-game__dialog--visible')).toBe(true);
    });
  });

  describe('choices', () => {
    const testChoices: Choice[] = [
      { text: 'Be nice', next: 'scene-nice' },
      { text: 'Be mean', next: 'scene-mean', tetherCost: -10 },
    ];

    beforeEach(() => {
      view = new GameView({ eventBus: bus });
      view.mount(document.body);
    });

    it('should show choices', () => {
      view.showChoices(testChoices);

      const choices = view.getElement().querySelectorAll('.uv7-game__choice');
      expect(choices).toHaveLength(2);
    });

    it('should show tether cost', () => {
      view.showChoices(testChoices);

      const cost = view.getElement().querySelector('.uv7-game__choice-cost');
      expect(cost?.textContent).toBe('-10');
    });

    it('should emit choice:selected on click', () => {
      const handler = vi.fn();
      bus.on('choice:selected', handler);

      view.showChoices(testChoices);

      const choice = view.getElement().querySelector('.uv7-game__choice') as HTMLButtonElement;
      choice.click();

      expect(handler).toHaveBeenCalledWith({ choice: testChoices[0], index: 0 });
    });

    it('should call onChoice callback', () => {
      const onChoice = vi.fn();
      view = new GameView({ eventBus: bus, onChoice });
      view.mount(document.body);

      view.showChoices(testChoices);

      const choice = view.getElement().querySelector('.uv7-game__choice') as HTMLButtonElement;
      choice.click();

      expect(onChoice).toHaveBeenCalledWith(testChoices[0], 0);
    });

    it('should hide choices after selection', () => {
      view.showChoices(testChoices);
      view.selectChoice(0);

      const container = view.getElement().querySelector('.uv7-game__choices');
      expect(container?.classList.contains('uv7-game__choices--visible')).toBe(false);
    });

    it('should respond to choice:show event', () => {
      bus.emit('choice:show', { choices: testChoices });

      const choices = view.getElement().querySelectorAll('.uv7-game__choice');
      expect(choices).toHaveLength(2);
    });
  });

  describe('click to advance', () => {
    it('should call onAdvance on click', () => {
      const onAdvance = vi.fn();
      view = new GameView({ eventBus: bus, onAdvance });
      view.mount(document.body);

      view.getElement().click();

      expect(onAdvance).toHaveBeenCalled();
    });

    it('should not advance when clicking choices', () => {
      const onAdvance = vi.fn();
      view = new GameView({ eventBus: bus, onAdvance });
      view.mount(document.body);

      view.showChoices([{ text: 'Option', next: 'scene' }]);

      const choice = view.getElement().querySelector('.uv7-game__choice') as HTMLButtonElement;
      choice.click();

      expect(onAdvance).not.toHaveBeenCalled();
    });
  });
});
