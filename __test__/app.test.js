const fs = require('fs')
const path = require('path')
const app = require('../src/app')
const React = require('react')
const utils = require('../src/util')

describe('testing regex extraction', () => {
    test('test content generation', () => {
        let details = {
            date: '8/8/8'
        }
        let originals = [
            {
                item: 'chocolate',
                quantity: '10'
            }
        ]
        let items = [
            {
                item: 'tiller',
                quantity: '9',
                duration: 'day',
                tq: '4',
                status: 'available',
                statusDate: '7/7/7',
                inquire: true
            },
            {
                item: 'aerator',
                quantity: '7',
                duration: 'hour',
                tq: '4',
                status: 'available',
                statusDate: '7/7/7'
            },
            {
                item: 'crazy blade',
                quantity: '2',
                duration: 'month',
                tq: '4',
                status: 'not available',
                statusDate: '7/7/7',
                statusTime: 'afternoon'
            },
            {
                item: "5' x 10' open",
                quantity: '4',
                duration: 'day',
                tq: '4',
                status: 'partial before',
                statusDate: '7/7/7',
                statusTime: '----'
            },
            {
                item: 'chocolate',
                quantity: '8',
                duration: 'day',
                tq: '4',
                status: 'partial after',
                statusDate: '7/7/7',
                statusTime: 'afternoon'
            },
            {
                item: "5' x 8' open",
                quantity: '1',
                duration: 'day',
                tq: '5',
                status: 'other store',
                statusDate: '7/7/7'
            }
        ]
        let mbb = new utils.MailBodyBuilder(items, details, originals)
        console.log(mbb.ComposeEMailString())
        //console.log(utils.groupBy(items,(e) => e.status + (['available','partial','not available'].includes(e.status) ? '' : e.statusDate)))
        //console.log(utils.requestedItems(details,items,originals))

    })
    test('test validate form', () => {
        let items = [
            {icheck:true},
            {icheck:false},
            {icheck:true}
        ]
        let noitems = [
            {icheck:false},
            {icheck:false}
        ]
        expect(app.validateForm({email: 'test@test'}, items)).not.toBeTruthy()
        expect(app.validateForm({email: 'tesst@t.dd'}, items)).toBeTruthy()
        expect(app.validateItems(items)).toBeTruthy()
        expect(app.validateItems(noitems)).not.toBeTruthy()
        expect(app.validateForm({email: 'tesst@t.dd'}, items)).toBeTruthy()
        expect(app.validateForm({email: 'test@t.'}, items)).not.toBeTruthy()
        expect(app.validateForm({email: 'tesst@t.dd'}, noitems)).not.toBeTruthy()
        
    })
    test('testing parse content', () => {
        let ex0 = fs.readFileSync(path.join(__dirname, '..', 'ex0')).toString()
        let ex1 = fs.readFileSync(path.join(__dirname, '..', 'ex1')).toString()
        //React.useState = jest.fn().mockReturnValue([{},(arg) => {}])
        let cont0 = app.parseContent(ex0)
        let cont1 = app.parseContent(ex1)

        console.log(cont0)
        console.log(cont1)
        expect(cont0).toMatchObject({
            email: 'xxx@gmail.com',
            date: '06/24/2024',
            phone: 'Contact by E-Mail',
            items: [
                {
                    item: 'Ozone Generator',
                    quantity: '1',
                    tq: '1',
                    duration: 'day',
                    price: '40.00'
                }
            ]
        })
        expect(cont1).toMatchObject({
            email: 'xxxx@gmail.com',
            date: '06/14/2024',
            phone: 'Contact by phone',
            items: [
                {
                    item: 'Toro TX 420/427 Compact Skid Steer',
                    quantity: '1',
                    tq: '1',
                    duration: 'day',
                    price: '225.00'
                },
                {
                    item: "5' X 10' Open Utility Trailer",
                    quantity: '1',
                    tq: '1',
                    duration: 'day',
                    price: '50.00'
                }
            ]
        })
    })

})