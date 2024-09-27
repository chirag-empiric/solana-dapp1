use anchor_lang::prelude::*;

declare_id!("7viEvPJH7HkTCdrbWtKutCa5VRjvrJSgPFc6KeqKVHdv");

#[program]
pub mod tokenthing {

    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.datasource.name = "Hello World".to_string();
        Ok(())
    }
}

#[account]
pub struct DataSource {
    name: String,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init_if_needed, payer = signer, space = 24 * 10 + 8, seeds = [b"names"], bump)]
    datasource: Account<'info, DataSource>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}
