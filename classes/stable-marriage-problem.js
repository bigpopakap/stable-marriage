const Gender = require('./gender.js');
const Person = require('./person.js');

class StableMarriageProblem {

    constructor (n = 20) {

        // Create elements
        this.men = [];
        this.women = [];
        var c = 0;
        while (c<n) {
            this.men[this.men.length] = new Person();
            this.women[this.women.length] = new Person('female');
            c++;
        }

        // Create priority lists
        this.men.forEach(v => {
            v.setPriorityList(this.shuffledArray(this.femaleIDs));
        });
        this.women.forEach(v => {
            v.setPriorityList(this.shuffledArray(this.maleIDs));
        });
    }

    get maleIDs () {
        return this.men.map(v => {
            return v.id;
        });
    }

    get femaleIDs () {
        return this.women.map(v => {
            return v.id;
        });
    }

    getPersonByID (gender, id) {
        var list = (gender.value == 'male') ? this.men : this.women;
        var c = 0;
        while (c < list.length) {
            if (list[c].id == id) {
                return list[c];
            }
            c++;
        }
        return null;
    }

    shuffledArray (orig) {
        var shuffle = new Array(orig.length);
        var c = 0;
        while (c<orig.length) {
            var pick = orig[Math.floor(Math.random()*orig.length)];
            if (shuffle.indexOf(pick) < 0) {
                shuffle[c] = pick;
                c++;
            }
        }
        return shuffle;
    }

    printPriorityTable () {
        var string = 'MEN:\n';
        this.men.forEach(v => {
            string += v.printPriorityList() + '\n';
        });
        string += '\nWOMEN:\n';
        this.women.forEach(v => {
            string += v.printPriorityList() + '\n';
        });
        return string;
    }

    existsFreeMan () {
        var result = false, c = 0;
        while (c < this.men.length) {
            if (!this.men[c].engagedWith) {
                result = true;
                break;
            }
            c++;
        }
        console.log('\n# # # Begin Iteration\nStableMarriageProblem.existsFreeMan() = ' + result);
        return result;
    }

    nextFreeMan (index) {
        var result = null;
        if (!this.men[index].engagedWith) {
            result = index;
        } else {
            var c = (index+1) % this.men.length;
            while (c != index) {
                if (!this.men[c].engagedWith) {
                    result = c;
                    break;
                }
                c = (c+1) % this.men.length;
            }
        }
        console.log('StableMarriageProblem.nextFreeMan() = ' + result);
        return result;
    }

    propose (manId, womanId) {
        let man = this.getPersonByID(new Gender('male'), manId),
            woman = this.getPersonByID(new Gender('female'), womanId);
        console.log('Woman ' + womanId + ': "My current husband is number ' +
            woman.priorityList.indexOf(woman.engagedWith) + ' on my list and you are number ' +
            woman.priorityList.indexOf(manId) + '"');
        if (woman.engagedWith !== null &&
            woman.priorityList.indexOf(woman.engagedWith) < woman.priorityList.indexOf(manId)) {
            man.nextProposal++;
            console.log('StableMarriageProlem.propose(' + manId + ', ' + womanId + ') - rejected');
            return false;
        }
        console.log('StableMarriageProblem.propose(' + manId + ', ' + womanId + ') - accepted');
        this.engage(man, woman);
        man.nextProposal++;
        return true;
    }

    engage (man, woman) {
        // divorce
        if (man.engagedWith !== null) {
            console.log('StableMarriageProblem.engage() : Divorcing man ' + man.id + ' from his wife');
            this.getPersonByID(new Gender('female'), man.engagedWith).engagedWith = null;
        }
        if (woman.engagedWith !== null) {
            console.log('StableMarriageProblem.engage() : Divorcing woman ' + woman.id + ' from her husband');
            this.getPersonByID(new Gender('male'), woman.engagedWith).engagedWith = null;
        }
        //engage
        console.log('StableMarriageProblem.engage() : Engaging man ' + man.id + ' and woman ' + woman.id);
        man.engagedWith = woman.id;
        woman.engagedWith = man.id;
    }

    match () {
        var c = 0;
        while (this.existsFreeMan()) {
            c = this.nextFreeMan(c);
            let proposer = this.men[c];
            while (proposer.nextProposal < proposer.priorityList.length &&
            !this.propose(proposer.id, proposer.priorityList[proposer.nextProposal])) {
                console.log('HULK');
            }
        }
    }
}

module.exports = StableMarriageProblem;