use anchor_lang::prelude::*;

declare_id!("CRjWCs644dmTa2BQjWW5AjvCkRpwmPtmF55CR6t4GmBG");

#[program]
pub mod rustshi {
    use super::*;

    pub fn participate(ctx: Context<MainDataSource>) -> Result<()> {
        let con = &mut ctx.accounts.hits;
        con.user_list.push(ctx.accounts.signer.key());
        con.hits += 1;
        Ok(())
    }
}

#[account]
pub struct Hits {
    user_list: Vec<Pubkey>,
    hits: u16,
}

#[derive(Accounts)]
pub struct MainDataSource<'info> {
    #[account(init_if_needed, payer = signer, space= 32 * 8 + 2 + 8, seeds = [b"helo"], bump)]
    hits: Account<'info, Hits>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}
