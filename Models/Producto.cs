
using System.ComponentModel.DataAnnotations;

namespace VentaProductos.Models;

public class Producto
{
    public int Id { get; set; }
    

    // [Required(ErrorMessage = "El nombre es obligatorio.")]
    // [StringLength(100, ErrorMessage = "El Nombre debe contener entre {3} y {100} caracteres.", MinimumLength = 3)]
    public string? NombreProducto { get; set; }
    public int Cantidad { get; set; }

    // [Required(ErrorMessage = "El Precio de Venta es obligatorio.")]
    // [Range(0.01, double.MaxValue, ErrorMessage = "El Precio de Venta debe ser mayor a 0.")]
    public float PrecioVenta { get; set; }

    // [Required(ErrorMessage = "El Precio de Compra es obligatorio.")]
    // [Range(0.01, double.MaxValue, ErrorMessage = "El Precio de Compra debe ser mayor a 0.")]
    public float PrecioCompra { get; set; }
}