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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
        {
            var ventas = await _context.Ventas.Include(x => x.Cliente).ToListAsync();

            return ventas;
        }

        // GET: api/Ventas/5
        // [HttpGet("{id}")]
        // public async Task<ActionResult<Venta>> GetVenta(int id)
        // {
        //     var venta = await _context.Ventas
        //                                 .Include
        //     FindAsync(id);

        //     if (venta == null)
        //     {
        //         return NotFound();
        //     }

        //     return venta;
        // }


        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVenta(int id)
        {
            var venta = await _context.Ventas
                                        .Include(v => v.Cliente) 
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

            return Ok(venta);
        }

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Venta>> PostVenta(Venta venta)
        {
            var cliente = await _context.Clientes
                                        .Include(c => c.Ventas)
                                        .FirstOrDefaultAsync(c => c.Id == venta.IdCliente);
                
            if (cliente == null)
            {
                return BadRequest("El cliente no existe");
            }

            if (cliente.Ventas != null && cliente.Ventas.Any(venta => venta.Finalizada != true))
            {
                return BadRequest("El cliente tiene pendiente una venta");
            }
            _context.Ventas.Add(venta);
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

            if (!venta.Finalizada)
            {
                return BadRequest("La venta no puede ser eliminada porque no esta finalizada");
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
