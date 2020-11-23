<template>
  <div class="home">

    <img src="@/assets/menu.svg" @click="openMenu" id="menu_btn" alt="menu icon">

    <section id="filters" ref="filterSection">
    <img @click="closeMenu" src="@/assets/close.svg" id="close_btn" alt="close icon">
      
      <!-- City Filter -->
      <p class="filterTitle">City</p>
      <ul class="checkbox_list"> 
        <li v-for="city in cities" :key="city">
          <input type="checkbox" :id="city" :value="city" v-model="checkedCities">
          <label :for="city">{{ city }}</label>
        </li>
      </ul>

      <hr>

      <!-- Cluster Filter -->
      <p class="filterTitle">Cluster</p>
      <ul class="checkbox_list">
        <li v-for="cluster in clusters" :key="cluster">
          <input type="checkbox" :id="cluster" :value="cluster" v-model="checkedClusters">
          <label :for="cluster">{{ cluster }}</label>
        </li>
      </ul>

      <hr>

      <!-- Live Filter  -->
      <p class="filterTitle">Is Live?</p>
      <div id="live_filter">
        <input type="radio" name="live_status" id="yes" value="1" v-model.number="liveStatus">
        <label for="yes">Yes</label>
        <input type="radio" name="live_status" id="no" value="0" v-model.number="liveStatus">
        <label for="no">No</label>
        <input type="radio" name="live_status" id="both" value="both" v-model="liveStatus" >
        <label for="both">Both</label>
      </div>

      <hr>

      <!-- Space Availablity Filter -->
      <p class="filterTitle">Space Availablity</p>
      <div id="space_filter">
        <input type="text" id="space" v-model="space">
        <p>has {{ space }} Square Feet or more</p>
      </div>
    </section>

    <main>
      <!-- Search Field -->
      <input id="search_bar" type="text" v-model="searchTerm" placeholder="Search Warehouses...">

      <!-- Warehouse List -->
      <ul id="warehouse_list">
        <router-link :class="[warehouse.is_live? 'live' : 'not_live']" tag="li" :to="{ name: 'details', params: { id: warehouse.id } }" v-for="warehouse in filteredWarehouseList" :key="warehouse.id">
          <div>
            <h4>Name</h4>
            <p>{{ warehouse.name }}</p>
          </div>
          <div>
            <h4>Cluster</h4>
            <p>{{ warehouse.cluster }}</p>
          </div>
          <div>
            <h4>Space Available</h4>
            <p>{{ warehouse.space_available }} sq.ft</p>
          </div>
          <div>
            <h4>City</h4>
            <p>{{ warehouse.city }}</p>
          </div>
        </router-link>
      </ul>
    </main>

  </div>
</template>

<script>
export default {
  data() {
    return {
      searchTerm: "",
      checkedCities: [],
      checkedClusters: [],
      liveStatus: "both",
      space: 1,
    }
  },
  methods: {
    openMenu() {
      console.log(this.$refs)
      this.$refs.filterSection.style.width = "13rem"
    },
    closeMenu() {
      this.$refs.filterSection.style.width = "0"
    }
  },
  computed: {
    warehouseList() {
      return this.$store.getters.getWarehouseList
    },
    cities() {
      let citiesWithDuplicates =  this.warehouseList.map((currentVal) => currentVal.city);
      return [...new Set(citiesWithDuplicates)] 
    },  
    clusters() {
      let clustersWithDuplicates =  this.warehouseList.map((currentVal) => currentVal.cluster);
      return [...new Set(clustersWithDuplicates)] 
    },
    
    filteredWarehouseList() {
      return this.warehouseList.filter(warehouse => {
        let searchResult = warehouse.name.toLowerCase().match(this.searchTerm.toLowerCase())
        let cityResult = (!this.checkedCities.length)? true: this.checkedCities.includes(warehouse.city);
        let clusterResult = (!this.checkedClusters.length)? true: this.checkedClusters.includes(warehouse.cluster);
        let spaceResult = warehouse.space_available >= this.space 
        let liveStatusResult = (this.liveStatus == "both")? true : (this.liveStatus == !!warehouse.is_live)
        return searchResult && cityResult && clusterResult && spaceResult && liveStatusResult
      })
    },
  },
}
</script>

<style scoped>
  #warehouse_list li {
    cursor: pointer;
    margin-bottom: 13px;
  }

  #filters {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    height: 100vh;
    overflow-x: hidden;
    background-color: #1111110d;
    width: 13rem;
  }

  #filters p.filterTitle {
    text-align: center;
    font-size: 1.25rem;
    color: darkslategray;
    text-decoration: underline;
  }

  #filters ul {
    width: 65%;
    margin: auto
  }

  .checkbox_list li input, #live_filter input {
    margin-right: 5px;
  }
  
  #space_filter, #live_filter {
    text-align: center;
    margin-left: -10px; 
  }

  main {
    margin-left: 13rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #search_bar {
    width: 450px;
    height: 2em;
    margin: auto;
    border-radius: 1rem;
    padding: 3px 7px;
  }

   #search_bar:focus {
    outline-style: none;
   }

   #warehouse_list {
     margin-top: 20px;
   }
   
   #warehouse_list li {
    width: 500px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    border-radius: 1rem;
    background: #1111110d;
   }

   li.live {
     border-right: 3px solid green; 
   }

   li.not_live {
     border-right: 3px solid red; 
   }

  @media screen and (max-width: 900px) {
    #filters {
      width: 0;
    }
  }

  @media screen and (min-width: 900px) {
    #close_btn {
      display: none;
    }
  }
</style>