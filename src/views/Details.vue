<template>
  <div class="details">
    <h1><span>#{{ $route.params.id }}</span> Warehouse details</h1>
    
    <button id="editBtn" @click="editMode = !editMode">Edit</button>

    <ul v-if="!editMode" id="details">
      <li v-for="(value, key) in currentWarehouse" :key="key">
        <span class="name">{{ key | formatName }}</span>
        <span class="value">{{ value }}</span>
      </li>
    </ul>

    <form v-else>
      <!-- <div v-for="(value, key) in currentWarehouse" :key="key">
        <label for="key" class="name">{{ key | formatName }}: </label>
        <input type="text" :name="key" :value="value">
      </div> -->

      <p v-if="formErrors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
        </ul>
      </p>
      
      <div>
        <label for="name" class="name">Name: </label>
        <input type="text" id="name" name="name" v-model="userData.name">
      </div>
      <div>
        <label for="city" class="name">City: </label>
        <input type="text" id="city" name="city" v-model="userData.city">
      </div>
      <div>
        <label for="space_available" class="name">Space Available: </label>
        <input type="text" id="space_available" name="space_available" v-model.number="userData.space_available">
      </div>
      <div>
        <label for="cluster" class="name">Cluster: </label>
        <input type="text" id="cluster" name="cluster" v-model="userData.cluster">
      </div>
      <div class="radio_div">
        <label for="radio">Is Live: </label>
        <div>
          <label for="is_true" class="name">
            <input type="radio" id="is_true" value="true" v-model="userData.is_live">
            True
          </label>

          <label for="is_false" class="name">
            <input type="radio" id="is_false" value="false" v-model="userData.is_live">
            False</label>
        </div>
      </div>

      <div id="form_btns">
        <input type="submit" value="Apply Changes" @click.prevent="validateAndUpdate">
        <button @click="cancel">Cancel</button>
      </div>
    </form>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        editMode: false,
        currentWarehouse: null,
        userData: null,
        formErrors: []
      }
    },
    methods: {
      validateAndUpdate() {
        this.formErrors = []

        if(!this.userData.name) {
          this.formErrors.push("Warehouse name required")
        }
        else if(!/^Warehouse-\d+$/.test(this.userData.name)) {
          this.formErrors.push("Warehouse name should be of the format: 'Warehouse-123'")
        } 
        
        if(!this.userData.space_available) {
          this.formErrors.push("Space Availability value required")
        }
        else if(typeof this.userData.space_available != "number" ) {
          this.formErrors.push("Space Availability value must be an integer")
        }
        else if(this.userData.space_available <= 1) {
          this.formErrors.push("Space Availability value must be greater than 0")
        }       

        if(!this.userData.cluster) {
          this.formErrors.push("Cluster name required")
        }
        else if(!/^cluster-[a-z]-\d+$/.test(this.userData.cluster)) {
          this.formErrors.push("Cluster should be of the format: 'cluster-a-2'")
        }

        if(!this.userData.city) {
          this.formErrors.push("City required")
        }

        if(!this.formErrors.length) {
          console.log("no errors in user data. can submit to the store")
          this.$store.dispatch("updateWarehouseData", this.userData)
          this.editMode = false;
        }

      },
      capitalize(val) {
        return val[0].toUpperCase() + val.slice(1)
      },
      cancel() {
        this.editMode = false;
        this.userData = JSON.parse(JSON.stringify(this.currentWarehouse))
        this.formErrors = []
      }
    },
    filters: {
      formatName(value) {
        return value.split("_").join(" ")
      }
    },
    created() {
      this.currentWarehouse = this.$store.getters.getWarehouseById(this.$route.params.id)
      this.userData = JSON.parse(JSON.stringify(this.currentWarehouse))
    },
    beforeRouteLeave(to, from, next) {
      let answer = true;
      if(this.editMode) {
        answer = confirm("Do you really want to leave? Edited stuff won't be saved")
      }
      (answer)? next(): next(false)
    }
  }

</script>

<style scoped>
  .name {
    text-transform: capitalize;
  }

  .details {
    max-width: 1000px;
    margin: auto; 
  }

  h1 {
    text-align: center;
  }

  h1 span {
    color: darkred;
  }

  button, input[type="submit"] {
    padding: 7px 14px;
    background: maroon;
    color: white;
    border: none;
    cursor: pointer;
  }

  input[type="submit"] {
    background: green;
    margin-right: 25px;
  }

  #editBtn {
    position: absolute;
    top: 0px;
    right: 500px;
  }

  #form_btns {
    display: flex;
    justify-content: center;
  }

   ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #details, form {
    margin-top: 45px !important;
  }

  #details li .name, label {
    font-size: 0.92em;
    font-weight: 600;
  }

  #details li {
    background: #1111110d;
    padding: 10px 20px;
    width: 250px;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    border: 0.5px solid black;
  }

  form {
    border: 0.5px solid black;
    background: #1111110d;
    padding: 15px 20px;
    width: 350px;
    margin: auto;
  }

  form div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    align-items: center;
  }

  input[type="text"] {
    padding: 5px;
  }

  .radio_div div label {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 20px;
  }

  form p {
    position: absolute;
    bottom: 50px;
    right: 20px;
    background: whitesmoke;
    border: 1px solid tomato;
    padding: 15px 20px;
  }

  form p ul {
    margin: 15px 10px; 
    list-style-type: circle;
  }

  form p ul li {
    margin-bottom: 10px;
  }

</style>