/**
 * ⛩️ The Gateway
 * Manages the Cross-Save bridge and Meta-States.
 */
export class Gateway {
    constructor(engine) {
        this.engine = engine;
        this.metaState = this.loadMetaState();
    }

    loadMetaState() {
        const raw = localStorage.getItem('uv7_gateway_data') || '{}';
        return JSON.parse(raw);
    }

    applyWorldState() {
        console.log("⛩️ Gateway: Applying World State...", this.metaState);

        if (this.metaState.rescued) {
            document.body.classList.add('state-rescued');
            console.log("🌟 State: RESCUED (Golden Timeline)");
        } else if (this.metaState.fragmented) {
            document.body.classList.add('state-fragmented');
            this.engine.visuals.trigger('glitch');
            console.log("💀 State: FRAGMENTED");
        }
    }

    saveTermination(endingType) {
        if (endingType === 'TRUE_ENDING') {
            this.metaState.rescued = true;
        } else if (endingType === 'BAD_ENDING') {
            this.metaState.fragmented = true;
        }
        localStorage.setItem('uv7_gateway_data', JSON.stringify(this.metaState));
    }
}
