use anchor_lang::prelude::*;

// importing context
use helo::cpi::accounts::StoreName;

// importing the Program Itself
use helo::program::Helo;

// importing the Data holder struct
use helo::{self, Data};

declare_id!("DqFb71fP9Hi7BjtbYYEE2JHRahvsnPxHUxoDn37kx84R");

#[program]
pub mod world {
    use super::*;

    pub fn update_name_shit(ctx: Context<ReadHelo>) -> Result<()> {
        // getting CPI program
        let cpi_program = ctx.accounts.helo_program.to_account_info();

        // getting cpi data
        let cpi_accounts = StoreName {
            data: ctx.accounts.data_from_helo.to_account_info(),
        };

        // creating the context
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        helo::cpi::update_name(cpi_context, "HEHEHE".to_string())?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct ReadHelo<'info> {
    #[account(mut)]
    pub data_from_helo: Account<'info, Data>,
    pub helo_program: Program<'info, Helo>,
}
