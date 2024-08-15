import {ref, onMounted, computed} from "vue"

export default function useCripto() {

    const criptomonedas = ref([]) // state
    const monedas = ref([ // state
        { codigo: 'USD', texto: 'Dolar de Estados Unidos'},
        { codigo: 'MXN', texto: 'Peso Mexicano'},
        { codigo: 'EUR', texto: 'Euro'},
        { codigo: 'GBP', texto: 'Libra Esterlina'},
        { codigo: 'ARG', texto: 'Peso Argentino'},
    ])
    const cotizacion = ref({}) // state
    const cargando = ref(false) // state

    onMounted(() => { // el codigo aca adentro se ejecuta apenas termina de cargarse el componente
        const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD"
        fetch(url)
            .then(respuesta => respuesta.json())
            .then( ({Data}) => criptomonedas.value = Data )
    })

    const obtenerCotizacion = async(cotizar) => {
    
        cotizacion.value = {}
        cargando.value = true
        
        try {
          const {moneda, criptomoneda} = cotizar
          const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
          
          const respuesta = await fetch(url)
          const data = await respuesta.json()
    
          cotizacion.value = data.DISPLAY[criptomoneda][moneda]
          
        } catch (error) {
          console.log(error);
        } finally { 
          // el finally se ejecuta siempre, independientemente de que se ejecute el try o el catch
          cargando.value = false
        }
    }

    const mostrarResultado = computed( () => {
        return Object.keys(cotizacion.value).length > 0
    })

    return {
        criptomonedas,
        monedas,
        cotizacion,
        cargando,
        obtenerCotizacion,
        mostrarResultado,
    }
}