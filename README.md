# vue-form

## Basic Usage
 
    import { vueform } from 'vueeform'

    Vue.use(vueform)

## Implementation

### Form Template

    <form submit.prevent="myMethods">
      <input name="email">
    </form>
    
### method function

    methods: {
      myMethods (e) {
          const q = this.$form(e) // pull all
          const data = q.refByName().getObject() // convert to object {email: 'yourimputmail@mail.com'}
      }
    }
