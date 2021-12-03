import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionCtorFields,
  TransactionInstruction,
} from '@solana/web3.js';
import { Borsh } from '@metaplex/utils';
import { Transaction } from '../../../Transaction';
import { VaultProgram } from '../../vault';
import { MetadataProgram } from '../../metadata';
import { AuctionProgram } from '../../auction';
import { MetaplexProgram } from '../MetaplexProgram';
import { ParamsWithStore } from '@metaplex/types';

export class SetStoreV2Args extends Borsh.Data<{ public: boolean; settingsUri: string }> {
  static readonly SCHEMA = this.struct([
    ['instruction', 'u8'],
    ['public', 'u8'],
    ['settingsUri', 'string'],
  ]);

  instruction = 23;
  public: boolean;
  settingsUri: string;
}

type SetStoreV2Params = {
  admin: PublicKey;
  config: PublicKey;
  isPublic: boolean;
  settingsUri: string;
};

export class SetStoreV2 extends Transaction {
  constructor(options: TransactionCtorFields, params: ParamsWithStore<SetStoreV2Params>) {
    super(options);
    const { feePayer } = options;
    const { admin, store, config, isPublic, settingsUri } = params;

    const data = SetStoreV2Args.serialize({ public: isPublic, settingsUri });

    this.add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: store,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: config,
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: admin,
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: feePayer,
            isSigner: true,
            isWritable: false,
          },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          {
            pubkey: VaultProgram.PUBKEY,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: MetadataProgram.PUBKEY,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: AuctionProgram.PUBKEY,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: MetaplexProgram.PUBKEY,
        data,
      }),
    );
  }
}
