import {faker} from '@faker-js/faker';
import pet from '../fixtures/pet.json';

pet.id = parseInt(faker.random.numeric(5));
pet.name = faker.animal.crocodilia();
pet.category.id = parseInt(faker.random.numeric(5));
pet.category.name = faker.animal.type();


describe('User can', () => {
  it('create pet via POST', () => {
    cy.request('POST', '/pet', pet).then(response => {
     expect(response.status).to.be.eq(200);
     expect(response.body.id).to.be.eql(pet.id);
      expect(response.body.name).to.be.eql(pet.name);
      expect(response.body.category).to.be.eql(pet.category);
    })
  })

  it('receive pet via GET', () => {
    cy.request('GET', `/pet/${pet.id}`, pet).then(response => {
      expect(response.status).to.be.eq(200);
      expect(response.body.id).to.be.eql(pet.id);
      expect(response.body.name).to.be.eql(pet.name);
      expect(response.body.category.id).to.be.eql(pet.category.id);
      expect(response.body.category.name).to.be.eql(pet.category.name);
    })
  })

    it('update pet via PUT', () => {
        pet.name = 'UpdatedPetName';
        pet.status = 'sold';

        cy.request('PUT', '/pet', pet).then(response => {
            expect(response.status).to.be.eq(200);
            expect(response.body.id).to.be.eql(pet.id);
            expect(response.body.name).to.be.eql(pet.name);
            expect(response.body.category).to.be.eql(pet.category);
            expect(response.body.status).to.be.eql(pet.status);
        })
    })

    it('receive pet by STATUS via GET', () => {
        cy.request('GET', `/pet/findByStatus?status=${pet.status}`, pet).then(response => {
            expect(response.status).to.be.eq(200);

            let pets = response.body;
            cy.log(pets);

            let petFromResponse = pets.filter(mypet => {
                return mypet.id === pet.id
            })
            expect(petFromResponse[0].id).to.be.eq(pet.id);
            expect(petFromResponse[0].name).to.be.eq(pet.name);
            expect(petFromResponse[0].category).to.be.eql(pet.category);
            expect(petFromResponse[0].status).to.be.eql(pet.status);
        })
    })

    it('update pet via POST with form data', () => {
        pet.name = 'UpdatedWithFormData'
        pet.status = 'testStatus'
        cy.request({
            method: 'POST',
            url: `/pet/${pet.id}`,
            form: true,
            body: `name=${pet.name}&status=${pet.status}`
        }).then(response => {
            expect(response.status).to.be.eq(200);
            expect(response.body.message).to.be.eq(JSON.stringify(pet.id));
            expect(response.body.code).to.be.eq(200);
        })
    })
    it('delete pet via DELETE', () => {
        cy.request('DELETE', `/pet/${pet.id}`, pet).then(response => {
            expect(response.status).to.be.eq(200);
            expect(response.body.message).to.be.eq(JSON.stringify(pet.id));
            expect(response.body.code).to.be.eq(200);
        }).then(() => {
            cy.request({
                method: 'GET',
                url: `/pet/${pet.id}`,
                failOnStatusCode: false
            }).then(response => {
                expect(response.status).to.be.eq(404);
            })
        })
    })
})