using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentaProductos.Models;

namespace VentaProductos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly Context _context;

        public VentasController(Context context)
        {
            _context = context;
        }

        // GET: api/Ventas
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
        // {
        //     return await _context.Ventas.ToListAsync();
        // }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
        {
            return await _context.Ventas.Include(v => v.DetalleVenta).ToListAsync();
        }


        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVenta(int id)
        {
            var venta = await _context.Ventas
                                    .Include(v => v.DetalleVenta)
                                    .FirstOrDefaultAsync(v => v.Id == id);

            if (venta == null)
            {
                return NotFound();
            }

            return venta;
        }

        // PUT: api/Ventas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVenta(int id, Venta venta)
        {
            if (id != venta.Id)
            {
                return BadRequest();
            }

            _context.Entry(venta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VentaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // [HttpPut("{id}/finalizar")]
        // public async Task<IActionResult> FinalizarVenta (int id)
        // {
        //     var venta = await _context.Ventas.FindAsync(id);
        //     if (venta == null) return NotFound();

        //     if (venta.Finalizada)
        //     {
        //         return BadRequest ("La venta ya esta finalizada");
        //     }

        //     venta.Finalizada = true;
        //     _context.Entry(venta).State = EntityState.Modified;
        //     await _context.SaveChangesAsync();

        //     return NoContent();
        // }

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Venta>> PostVenta(Venta venta, List<int> productosIds)
        {

            // Verificar si el cliente tiene una venta sin finalizar
            var ventaActiva = await _context.Ventas
                                    .Where(v => v.IdCliente == venta.IdCliente && !v.Finalizada)
                                    .FirstOrDefaultAsync();
            if (ventaActiva != null)
            {
                return BadRequest("El cliente ya tiene una venta activa. Debe finalizar la venta antes de crear una nueva.");
            }

        //crear la venta y sus detalles
            _context.Ventas.Add(venta);
            await _context.SaveChangesAsync();


            foreach (var ProductoId in productosIds)
            {
                _context.DetalleVentas.Add(new DetalleVenta { IdProducto = ProductoId, IdVenta = venta.Id });
            }
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVenta", new { id = venta.Id }, venta);
        }

        // DELETE: api/Ventas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            var venta = await _context.Ventas.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }
         _context.Ventas.Remove(venta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VentaExists(int id)
        {
            return _context.Ventas.Any(e => e.Id == id);
        }
    }
}
