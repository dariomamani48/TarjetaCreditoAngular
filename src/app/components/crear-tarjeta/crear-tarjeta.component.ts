import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading=false;
  titulo=' Agregar Tarjeta'
  id: string| undefined;

  constructor(private fb:FormBuilder, private _tarjetaService: TarjetaService,private toastr: ToastrService) {
    this.form= this.fb.group({
      titular:['',[Validators.required,Validators.maxLength(20), Validators.minLength(5)]],
      numeroTarjeta:['',[Validators.required,Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion:['',[Validators.required,Validators.maxLength(5), Validators.minLength(5)]],
      cvv:['',[Validators.required,Validators.maxLength(3), Validators.minLength(3)]]
    })
   }

  ngOnInit(): void {
    this._tarjetaService.getTarjetaEdit().subscribe(data=>{
      console.log(data)
      this.id = data.id
      this.titulo='Editar Tarjeta'
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      })
    })
  }
  crearTarjeta(){
    if(this.id ===undefined){
      this.agregarTarjeta();
    }else{
      this.editarTarjeta(this.id)
    }
    
  }

  editarTarjeta(id:string){
    const TARJETA: any={
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      
      fechaActualizacion: new Date()

    }
    this.loading=true;
    this._tarjetaService.editarTarjeta(id, TARJETA).then(()=>{
      this.loading=false;
      this.titulo='agregar Tarjeta'
      this.form.reset();
      this.id= undefined;
      this.toastr.info('se actualizo la tarjeta','registro actualizado')
    },error=>{
      console.log(error)
    })
  }

  agregarTarjeta(){
    const TARJETA: TarjetaCredito={
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()

    }

    console.log(TARJETA)
    this.loading= true;
    this._tarjetaService.guartarTarjeta(TARJETA).then(()=>{
      console.log('tarjeta ok')
      this.loading=false;
      
      this.toastr.success('Tarjeta registrada correctamente','Tarjeta Registrada')
      this.form.reset();
    },error=>{
      this.toastr.error('oops hubo un error')
      console.log(error)
    })
  }

}
