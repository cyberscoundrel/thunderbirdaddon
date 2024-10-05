/*const ana = (str) => {
    if(str.length > 0) {
        if(['a', 'e', 'i', 'o', 'u'].indexOf(c.toLowerCase()) !== -1) {
            return `an ${str}`
        }else{
            return `a ${str}`
        }
    }
    return ''

}*/

export class MailBodyBuilder {
    constructor(items, details, originals) {
        this.items = items
        this.details = details
        this.originals = originals
        this.byDuration = catagorizeBy(this.items, (e) => e.tq + e.duration)
        this.byDW = this.items.filter((e) => e.dwcheck)
        this.noDW = this.items.filter((e) => !e.dwcheck)
        this.byStatus = catagorizeBy(this.items,(e) => e.status + (['available','partial','not available', 'other store'].includes(e.status) ? '' : e.statusDate))
        this.inquireAvailable = this.items.filter((e) => e.status == 'available' && e.inquire)
        this.notAvailable = this.byStatus.filter((e) => !['available','other store'].includes(e.name))
        this.otherStore = this.byStatus.filter((e) => e.name == 'other store')
        this.rstr = ''
    }
    ComposeEMailString = () => {
        this.firstLines()
        this.requestedItems()
        this.unavailableItems()
        this.quantityMismatch()
        this.otherStoreItems()
        this.priceCalc()
        this.insertCustomComment()
        this.inquireAvailableItems()
        this.requestedDocuments()
        this.lastLines()
        return this.rstr
    }
    firstLines = () => {
        this.rstr += `Hello${this.details.rname ? this.details.rname : ''},<br><br>
        We received your quote request for${this.items.length > 3 ? ':' : ''}`
    }
    lastLines = () => {
        if(this.inquireAvailable.length > 0){
            this.rstr += `If you are interested in making this a reservation, or have any questions, reply to this email and I will be happy to assist you.<br><br>`
        }
        this.rstr += `
    
        Thank you,<br><br>

        ${this.details.sname? this.details.sname : ''}
        J&F Reddy Rents<br>
        3320 Republic Ave<br>
        Saint Louis Park, MN, 55426<br>
        reddyrents.com
        `
    }
    quantityMismatch = () => {
        let uPartials = this.items.filter((elm) => /partial/gm.test(elm.status) && this.originals && this.originals.find((em) => em.item === elm.item) && parseInt(this.originals.find((em) => em.item === elm.item).quantity) > parseInt(elm.quantity))
        
    
        if(uPartials.length > 0) {
            this.rstr += formattedItemListString(uPartials, false, (elm) => `only ${elm.quantity} of `) + ' are available. '
        }
        
    }
    priceCalc = () => {
        let tpndw = 0
        let dwp = 0
        let totalwithtax = 0
        
        this.items.forEach((e) => {
            tpndw += parseFloat(e.price) * parseInt(e.quantity)
        })
        this.byDW.forEach((e) => {
            dwp += parseFloat(e.price) * parseInt(e.quantity)
        })
        dwp = (dwp * 0.12).toFixed(2)
        totalwithtax = (parseFloat(tpndw) + parseFloat(dwp) + ((parseFloat(tpndw) + parseFloat(dwp)) * 0.08525)).toFixed(2)
        this.rstr += `The approximate total price for these items${dwp > 0?  ` with an optional damage waiver of ${dwp}` : ''} is $${totalwithtax}. ${this.noDW.length ? `${capitalize(formattedItemListString(this.noDW, false))} are not covered by the damage waiver.` : ''}`
    }
    requestedItems = () => {
    
        if(this.byDuration.length > 1) {
            
            let rs = this.byDuration.map((e, i) => {
                return ` ${i == this.byDuration.length - 1 ? 'and ' : ''}` + formattedItemListString(e.value) + ` for ${e.value[0].tq + ' ' + e.value[0].duration + '(s)'}`
            })
            this.rstr += rs
    
    
        } else {
            this.rstr += formattedItemListString(this.items) + ` for ${this.items[0].tq + this.items[0].duration}`
        }
    
        this.rstr += ` on ${this.details.date}. `
    }
    unavailableItems = () => {
        if(this.notAvailable.length > 0){
            this.rstr += 'Unfortunately, '
            this.notAvailable.forEach((e) => {
                this.rstr += `${formattedItemListString(e.value, false)} ${e.value.length > 1 || parseInt(e.value.at(-1).quantity) > 1 ? 'are' : 'is'} ${/partial/.test(e.name) ? 'only partially'  : 'not'} available${e.value[0].statusDate && /before/gm.test(e.value[0].status) ? ' until ' + e.value[0].statusDate : (e.value[0].statusDate && /after/gm.test(e.value[0].status) ? ' after ' + e.value[0].statusDate : '')}${/before|after/gm.test(e.value[0].status) && e.value[0].statusTime && e.value[0].statusTime != '----'? ` in the ${e.value[0].statusTime}`:''}. `
            })
            
        }

    }
    otherStoreItems = () => {
        if(this.otherStore && this.otherStore.length > 0 && this.otherStore[0].value.length > 0) {
            this.rstr += `${formattedItemListString(this.otherStore[0].value, false)} ${this.otherStore[0].value.length > 1 || this.otherStore[0].value.at(-1).quantity > 1 ? 'are' : 'is'} at the Hiawatha location. `
        }

    }
    insertCustomComment = () => {
        if(this.details.comment && this.details.comment.length > 0) {
            this.rstr += this.details.comment
        }
    }
    inquireAvailableItems = () => {
        if(this.inquireAvailable.length > 0) {
            this.rstr += `What are you looking to use ${formattedItemListString(this.inquireAvailable, false)} for?`
        }
    }
    requestedDocuments = () => {
        if(this.details.dl || this.details.poi){
            this.rstr += `Be sure to bring in a credit card in your or your company's name${this.details.dl && this.details.poi ? ', ': ' and '}${this.details.dl? `your driver's license` : ''}${this.details.dl && this.details.poi ? ' and': ''}${this.details.poi? `proof of vehicle insurance that covers you and your vehicle` : ''}.`
        }
    }
    
    
}
const the_s = (str, q, quant = true) => {
    return `${q > 1 && quant? `${q}` : 'the'} ${str}${q > 1 ? 's' : ''}`
}
const formattedItemListString = (i, quant = true, cond = (e) => '') => {
    if(i.length > 1) {
        return i.slice(0,-1).map((e) => cond(e) + the_s(e.item, parseInt(e.quantity), quant)).join(', ') + ' and ' + cond(i.at(-1)) + the_s(i.at(-1).item, parseInt(i.at(-1).quantity), quant)
    }else{
        return cond(i[0]) + the_s(i[0].item, parseInt(i[0].quantity), quant)
    }
}
const catagorizeBy = (items, ctg) => {
    let map = new Map()
    
    items.forEach((e) => {
        if(map.has(ctg(e))) {
            map.get(ctg(e)).push(e)
        } else {
            map.set(ctg(e), [e])
        }
    })
    return Array.from(map, ([ n, v ]) => ({ name: n, value: v }))
}
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}


/*export const requestedItems = () => {
    

    

    //quantityMismatch(items, originals)

    /*if(notAvailable.length > 0){
        rstr += 'Unfortunately, '
        notAvailable.forEach((e) => {
            rstr += `${formattedItemListString(e.value, false)} ${e.value.length > 1 || parseInt(e.value.at(-1).quantity) > 1 ? 'are' : 'is'} ${['partial', 'partial before','partial after'].includes(e.name) ? 'only partially'  : 'not'} available${['available before', 'partial before'].includes(e.value[0].status) ? ' until ' + e.value[0].statusDate : (['available after', 'partial after'].includes(e.value[0].status) ? ' after ' + e.value[0].statusDate : '')}. `
        })
        
    }*/

    




    

    

    

    //return rstr
    


    
    

//}
